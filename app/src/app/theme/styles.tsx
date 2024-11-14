// Theme
import config from "../../../tailwind.config";

export const styles = {
  text: {
    color: "white",
  },
  label: {
    color: config.theme?.extend?.colors?.gray,
    "&.Mui-focused": {
      color: config.theme?.extend?.colors?.gray,
    },
  },
  menu: {
    "&.MuiMenuItem-root": {
      backgroundColor: config.theme?.extend?.colors?.dark,
      color: "white",
    },
  },
  card: {
    backgroundColor: config.theme?.extend?.colors?.dark,
  },
  select: {
    height: "3.5rem",
    color: config.theme?.extend?.colors?.gray,
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: config.theme?.extend?.colors?.gray,
    },
    "& .MuiSvgIcon-root": {
      color: config.theme?.extend?.colors?.gray,
    },
    "&:hover": {
      "&& fieldset": {
        border: `1px solid ${config.theme?.extend?.colors?.electricity}`,
      },
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: config.theme?.extend?.colors?.electricity,
    },
  },
  radio: {
    color: config.theme?.extend?.colors?.gray,
    fontSize: "1.5rem",
    "&.Mui-checked": {
      color: config.theme?.extend?.colors?.electricity,
    },
    "&.Mui-focused": {
      color: config.theme?.extend?.colors?.electricity,
    },
  },
  divider: {
    backgroundColor: "white",
  },
  textField: {
    "& .MuiInputBase-root": {
      color: config.theme?.extend?.colors?.gray,
    },
    "& label": {
      color: config.theme?.extend?.colors?.gray,
    },
    "& label.Mui-focused": {
      color: config.theme?.extend?.colors?.gray,
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "white",
      },
      "&:hover fieldset": {
        borderColor: "white",
      },
      "&.Mui-focused fieldset": {
        borderColor: config.theme?.extend?.colors?.electricity,
      },
    },
  },
  secondaryButton: {
    color: config.theme?.extend?.colors?.electricity,
  },
};
