import numpy as np
import numpy.typing as npt

from math import pi
import cvxopt

# pyDRTtools related package
from .. import utilities
from ..helpers import matrices as helpers


class Spectra():
    
    # The EIS_object class stores the input data and the DRT result.
    tau_vector: npt.NDArray | None = None
    gamma_vector: npt.NDArray | None = None
      
    def __init__(self, freq: npt.NDArray[np.float64], Z_prime: npt.NDArray[np.float64], Z_double_prime: npt.NDArray[np.float64]):
        
        """
        This is EIS_object class 
        Inputs:
            freq: frequency of the EIS measurement
            Z_prime: real part of the impedance
            Z_double_prime: imaginery part of the impedance
        """
        # EIS Properties
        self.freq: npt.NDArray[np.float64] = freq
        self.Z_prime: npt.NDArray[np.float64] = Z_prime
        self.Z_double_prime: npt.NDArray[np.float64] = Z_double_prime
        self.Z_exp: npt.NDArray[np.complex64] = Z_prime + 1j*Z_double_prime
        
        # EIS Mathematics
        self.tau: npt.NDArray[np.float64] = 1/self.freq
        self.tau_fine: npt.NDArray[np.float64] = np.logspace(np.log10(self.tau.min())-0.5, np.log10(self.tau.max())+0.5 ,10*freq.shape[0]) 
        self.method: str = 'none'

    # Assign tau and gamma as they are calculated in simple_run()
    def __assign(self, tau: npt.NDArray[np.float64], gamma: npt.NDArray[np.float64]) -> None:
        self.tau_vector: npt.NDArray[np.float64] = tau
        self.gamma_vector: npt.NDArray[np.float64] = gamma

    def results(self) -> tuple[list, list]:

        return self.tau_vector.tolist(), self.gamma_vector.tolist()


    # Perform the simple_run() from pyDRT tools
    def simple_run(self, rbf_type: str = 'Gaussian', data_used: str = 'Combined Re-Im Data', induct_used: int = 0, der_used: str = '1st order', cv_type: str = 'GCV', reg_param: float = 1E-3, shape_control: str = 'FWHM Coefficient', coeff: float = 0.5) -> None:

        """
        This function enables to compute the DRT using ridge regression (also known as Tikhonov regression)
        References:
            T. H. Wan, M. Saccoccio, C. Chen, F. Ciucci, Influence of the discretization methods on the distribution of relaxation times deconvolution: Implementing radial basis functions with DRTtools, Electrochimica Acta 184 (2015) 483-499.
        Inputs:
            self: an instance of spectra, the EIS spectrum
            rbf_type: discretization function
            data_used: part of the EIS spectrum used for regularization
            induct_used: treatment of the inductance part
            der_used: order of the derivative considered for the M matrix
            cv_type: regularization method used to select the regularization parameter for ridge regression
            reg_param: regularization parameter applied when "custom" is used for cv_type 
            shape_control: option for controlling the shape of the radial basis function (RBF) 
            coeff: magnitude of the shape control
        """
    
    
        # Step 1.1: define the optimization bounds
        N_freqs = self.freq.shape[0]
        N_taus = self.tau.shape[0]
        self.b_re = self.Z_exp.real
        self.b_im = self.Z_exp.imag

        # Step 1.2: compute epsilon
        self.epsilon = utilities.compute_epsilon(self.freq, coeff, rbf_type, shape_control)
        
        # Step 1.3: compute A matrix
        self.A_re_temp = utilities.assemble_A_re(self.freq, self.tau, self.epsilon, rbf_type)
        self.A_im_temp = utilities.assemble_A_im(self.freq, self.tau, self.epsilon, rbf_type)
        
        # Step 1.4: compute M matrix
        if der_used == '1st order':
            self.M_temp = utilities.assemble_M_1(self.tau, self.epsilon, rbf_type)
        elif der_used == '2nd order':
            self.M_temp = utilities.assemble_M_2(self.tau, self.epsilon, rbf_type)
        
        # Step 2: conduct ridge regularization
        if data_used == 'Combined Re-Im Data': # select both parts of the impedance for the simple run
    
            if induct_used == 0 or induct_used == 2: # without considering the inductance
                N_RL = 1 # N_RL length of resistance plus inductance
                self.A_re = np.zeros((N_freqs, N_taus+N_RL))
                self.A_re[:,N_RL:] = self.A_re_temp
                self.A_re[:,0] = 1
                
                self.A_im = np.zeros((N_freqs, N_taus+N_RL))
                self.A_im[:,N_RL:] = self.A_im_temp
                
                self.M = np.zeros((N_taus+N_RL, N_taus+N_RL))
                self.M[N_RL:,N_RL:] = self.M_temp
                
                # optimally select the regularization level
                # initial guess for the hyperparameter
                log_lambda_0 = np.log(reg_param) # initial guess for lambda
                #
                if cv_type=='custom':
                    self.lambda_value = reg_param
                else:
                    self.lambda_value = utilities.optimal_lambda(self.A_re, self.A_im, self.b_re, self.b_im, self.M, data_used, induct_used, log_lambda_0, cv_type) 
                    
                print('The value of the regularization parameter is', self.lambda_value) # to check the value of lambda
                
                # recover the DRT using cvxopt
                H_combined,c_combined = utilities.quad_format_combined(self.A_re, self.A_im, self.b_re, self.b_im, self.M, self.lambda_value)
                # enforce positivity constraint # N_RL
                ## bound matrix
                G = cvxopt.matrix(-np.identity(self.b_re.shape[0]+N_RL))
                h = cvxopt.matrix(np.zeros(self.b_re.shape[0]+N_RL))
                # Formulate the quadratic programming problem
                # Solve the quadratic programming problem
                sol = cvxopt.solvers.qp(cvxopt.matrix(H_combined), cvxopt.matrix(c_combined),G,h)
                x = np.array(sol['x']).flatten()

                # prepare for HMC sampler, it will be used if needed
                self.mu_Z_re = self.A_re@x
                self.mu_Z_im = self.A_im@x
                self.res_re = self.mu_Z_re-self.b_re
                self.res_im = self.mu_Z_im-self.b_im

                # only consider std of residuals in both parts
                sigma_re_im = np.std(np.concatenate([self.res_re,self.res_im]))
                inv_V = 1/sigma_re_im**2*np.eye(N_freqs)
            
                Sigma_inv = (self.A_re.T@inv_V@self.A_re) + (self.A_im.T@inv_V@self.A_im) + (self.lambda_value/sigma_re_im**2)*self.M
                mu_numerator = self.A_re.T@inv_V@self.b_re + self.A_im.T@inv_V@self.b_im
            
            elif induct_used == 1: # considering the inductance
                N_RL = 2
                self.A_re = np.zeros((N_freqs, N_taus+N_RL))
                self.A_re[:, N_RL:] = self.A_re_temp
                self.A_re[:,1] = 1
                
                self.A_im = np.zeros((N_freqs, N_taus+N_RL))
                self.A_im[:, N_RL:] = self.A_im_temp
                self.A_im[:,0] = 2*pi*self.freq

                self.M = np.zeros((N_taus+N_RL, N_taus+N_RL))
                self.M[N_RL:,N_RL:] = self.M_temp
                
                # optimally select the regularization level
                log_lambda_0 = np.log(reg_param) # initial guess for lambda
                if cv_type=='custom':
                    self.lambda_value = reg_param
                else:
                    self.lambda_value = utilities.optimal_lambda(self.A_re, self.A_im, self.b_re, self.b_im, self.M, data_used, induct_used, log_lambda_0, cv_type) 
                    
                print('The value of the regularization parameter is', self.lambda_value) # to check the value of lambda
                
                # recover the DRT using cvxopt
                H_combined,c_combined = utilities.quad_format_combined(self.A_re, self.A_im, self.b_re, self.b_im, self.M, self.lambda_value)
                # enforce positivity constraint # N_RL
                ## bound matrix
                G = cvxopt.matrix(-np.identity(self.b_re.shape[0]+N_RL))
                h = cvxopt.matrix(np.zeros(self.b_re.shape[0]+N_RL))
                # Formulate the quadratic programming problem
                # Solve the quadratic programming problem
                sol = cvxopt.solvers.qp(cvxopt.matrix(H_combined), cvxopt.matrix(c_combined),G,h)
                x = np.array(sol['x']).flatten()

                self.mu_Z_re = self.A_re@x
                self.mu_Z_im = self.A_im@x
                self.res_re = self.mu_Z_re-self.b_re
                self.res_im = self.mu_Z_im-self.b_im

                # only consider std of residuals in both parts
                sigma_re_im = np.std(np.concatenate([self.res_re,self.res_im]))
                inv_V = 1/sigma_re_im**2*np.eye(N_freqs)
            
                Sigma_inv = (self.A_re.T@inv_V@self.A_re) + (self.A_im.T@inv_V@self.A_im) + (self.lambda_value/sigma_re_im**2)*self.M
                mu_numerator = self.A_re.T@inv_V@self.b_re + self.A_im.T@inv_V@self.b_im
                
        elif data_used == 'Im Data': # select the imaginary part of the impedance for the simple run
            
            if induct_used == 0 or induct_used == 2: # without considering the inductance
                N_RL = 0 # N_RL length of resistance plus inductance
                self.A_re = np.zeros((N_freqs, N_taus+N_RL))
                self.A_re[:, N_RL:] = self.A_re_temp
                
                self.A_im = np.zeros((N_freqs, N_taus+N_RL))
                self.A_im[:, N_RL:] = self.A_im_temp
                
                self.M = np.zeros((N_taus+N_RL, N_taus+N_RL))
                self.M[N_RL:,N_RL:] = self.M_temp
                
                # optimally select the regularization level
                log_lambda_0 = np.log(reg_param) # initial guess for lambda
                if cv_type=='custom':
                    self.lambda_value = reg_param
                else:
                    self.lambda_value = utilities.optimal_lambda(self.A_re, self.A_im, self.b_re, self.b_im, self.M, data_used, induct_used, log_lambda_0, cv_type) 
                    
                print('The value of the regularization parameter is', self.lambda_value) # to check the value of lambda
                
                # recover the DRT using cvxopt
                H_im, c_im = utilities.quad_format_separate(self.A_im, self.b_im, self.M, self.lambda_value)
                # enforce positivity constraints
                ## bound matrix
                G = cvxopt.matrix(-np.identity(self.b_im.shape[0]+N_RL))
                h = cvxopt.matrix(np.zeros(self.b_im.shape[0]+N_RL))
                # Formulate the quadratic programming problem
                # Solve the quadratic programming problem
                sol = cvxopt.solvers.qp(cvxopt.matrix(H_im), cvxopt.matrix(c_im),G,h)
                x = np.array(sol['x']).flatten()

                # prepare for HMC sampler
                self.mu_Z_re = self.A_re@x
                self.mu_Z_im = self.A_im@x
                self.res_re = self.mu_Z_re-self.b_re
                self.res_im = self.mu_Z_im-self.b_im
                
                # only consider std of residuals in the imaginary part
                sigma_re_im = np.std(self.res_im)
                inv_V = 1/sigma_re_im**2*np.eye(N_freqs)
                
                Sigma_inv = (self.A_im.T@inv_V@self.A_im) + (self.lambda_value/sigma_re_im**2)*self.M
                mu_numerator = self.A_im.T@inv_V@self.b_im

                
            elif induct_used == 1: # considering the inductance
                N_RL = 1
                self.A_re = np.zeros((N_freqs, N_taus+N_RL))
                self.A_re[:, N_RL:] = self.A_re_temp
                
                self.A_im = np.zeros((N_freqs, N_taus+N_RL))
                self.A_im[:, N_RL:] = self.A_im_temp
                self.A_im[:,0] = 2*pi*self.freq
                
                self.M = np.zeros((N_taus+N_RL, N_taus+N_RL))
                self.M[N_RL:,N_RL:] = self.M_temp
                
                # optimally select the regularization level
                log_lambda_0 = np.log(reg_param) # initial guess for lambda
                if cv_type=='custom':
                    self.lambda_value = reg_param
                else:
                    self.lambda_value = utilities.optimal_lambda(self.A_re, self.A_im, self.b_re, self.b_im, self.M, data_used, induct_used, log_lambda_0, cv_type) 

                print('The value of the regularization parameter is', self.lambda_value) # to check the value of lambda
                
                # recover the DRT using cvxopt
                
                H_im, c_im = utilities.quad_format_separate(self.A_im, self.b_im, self.M, self.lambda_value)
                #
                # enforce positivity constraints
                # bound matrix
                G = cvxopt.matrix(-np.identity(self.b_im.shape[0]+N_RL))
                h = cvxopt.matrix(np.zeros(self.b_im.shape[0]+N_RL))
                # Formulate the quadratic programming problem
                ##
                # Solve the quadratic programming problem
                sol = cvxopt.solvers.qp(cvxopt.matrix(H_im), cvxopt.matrix(c_im),G,h)
                x = np.array(sol['x']).flatten()

                # prepare for HMC sampler
                self.mu_Z_re = self.A_re@x
                self.mu_Z_im = self.A_im@x
                self.res_re = self.mu_Z_re-self.b_re
                self.res_im = self.mu_Z_im-self.b_im
                
                # only consider std of residuals in the imaginary part
                sigma_re_im = np.std(self.res_im)
                inv_V = 1/sigma_re_im**2*np.eye(N_freqs)
                
                Sigma_inv = (self.A_im.T@inv_V@self.A_im) + (self.lambda_value/sigma_re_im**2)*self.M
                mu_numerator = self.A_im.T@inv_V@self.b_im

        elif data_used == 'Re Data': # select the real part of the impedance for the simple run
            N_RL = 1
            self.A_re = np.zeros((N_freqs, N_taus+N_RL))
            self.A_re[:, N_RL:] = self.A_re_temp
            self.A_re[:,0] = 1
            
            self.A_im = np.zeros((N_freqs, N_taus+N_RL))
            self.A_im[:, N_RL:] = self.A_im_temp

            self.M = np.zeros((N_taus+N_RL, N_taus+N_RL))
            self.M[N_RL:,N_RL:] = self.M_temp
            
            # optimally select the regularization level
            log_lambda_0 = np.log(reg_param) # initial guess for lambda
            if cv_type=='custom':
                self.lambda_value = reg_param
            else:
                self.lambda_value = utilities.optimal_lambda(self.A_re, self.A_im, self.b_re, self.b_im, self.M, data_used, induct_used, log_lambda_0, cv_type) 

            print('The value of the regularization parameter is', self.lambda_lambda) # to check the value of lambda
            
            # recover the DRT using cvxopt 
            H_re,c_re = utilities.quad_format_separate(self.A_re, self.b_re, self.M, self.lambda_value)
        
            # enforce positivity constraints
            # ## bound matrix
            G = cvxopt.matrix(-np.identity(self.b_re.shape[0]+N_RL))
            h = cvxopt.matrix(np.zeros(self.b_re.shape[0]+N_RL))
            # Formulate the quadratic programming problem
            ###
            # Solve the quadratic programming problem
            sol = cvxopt.solvers.qp(cvxopt.matrix(H_re), cvxopt.matrix(c_re),G,h)
            x = np.array(sol['x']).flatten()

            # prepare for HMC sampler
            self.mu_Z_re = self.A_re@x
            self.mu_Z_im = self.A_im@x       
            self.res_re = self.mu_Z_re-self.b_re
            self.res_im = self.mu_Z_im-self.b_im
            
            # only consider std of residuals in the real part
            sigma_re_im = np.std(self.res_re)
            inv_V = 1/sigma_re_im**2*np.eye(N_freqs)
            
            Sigma_inv = (self.A_re.T@inv_V@self.A_re) + (self.lambda_value/sigma_re_im**2)*self.M
            mu_numerator = self.A_re.T@inv_V@self.b_re

        self.Sigma_inv = (Sigma_inv+Sigma_inv.T)/2
        
        # test if the covariance matrix is positive definite
        if (helpers.is_pd(self.Sigma_inv)==False):
            self.Sigma_inv = utilities.nPD.nearest_PD(self.Sigma_inv) # if not, use the nearest positive definite matrix
        
        L_Sigma_inv = np.linalg.cholesky(self.Sigma_inv)
        self.mu = np.linalg.solve(L_Sigma_inv, mu_numerator)
        self.mu = np.linalg.solve(L_Sigma_inv.T, self.mu)
        # self.mu = np.linalg.solve(self.Sigma_inv, mu_numerator)
        
        # Step 3: obtaining the result of inductance, resistance, and gamma  
        if N_RL == 0: 
            self.L, self.R = 0, 0        
        elif N_RL == 1 and data_used == 'Im Data':
            self.L, self.R = x[0], 0    
        elif N_RL == 1 and data_used != 'Im Data':
            self.L, self.R = 0, x[0]
        elif N_RL == 2:
            self.L, self.R = x[0:2]
            
        self.x = x[N_RL:]
        tau_vector, gamma_vector = utilities.x_to_gamma(x[N_RL:], self.tau_fine, self.tau, self.epsilon, rbf_type)

        self.__assign(tau_vector, gamma_vector)

        self.N_RL = N_RL 
        self.method = 'simple'
        
        return self