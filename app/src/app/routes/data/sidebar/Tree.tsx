import { GraphT } from "@/lib/types/warehouse";

interface Props {
  tree: GraphT;
  node: GraphT;
  depth: number;
  ancestor: string;
  handleLeaf: (data: GraphT, leaf: GraphT, ancestor: string) => void;
}

const TreeNode: React.FC<Props> = ({
  tree,
  node,
  depth,
  ancestor,
  handleLeaf,
}) => {
  return (
    <li>
      <div className="prose" onClick={() => handleLeaf(tree, node, ancestor)}>
        <small className="text-xs">{node.cls}</small>
        <h5>{node.name}</h5>
      </div>

      {node.children.length > 0 && (
        <ul>
          {node.children.map((child: GraphT, index: number) => (
            <TreeNode
              key={index}
              tree={tree}
              node={child}
              ancestor={ancestor}
              depth={depth + 1}
              handleLeaf={handleLeaf}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export const RenderTree: React.FC<{
  graph: GraphT;
  handleLeaf: (data: GraphT, leaf: GraphT, ancestor: string) => void;
}> = ({ graph, handleLeaf }) => {
  const tree = graph;
  const ancestor = tree.name;

  return (
    <ul className="menu bg-inherit rounded-box w-full">
      <TreeNode
        tree={tree}
        node={graph}
        depth={0}
        ancestor={ancestor}
        handleLeaf={handleLeaf}
      />
    </ul>
  );
};
