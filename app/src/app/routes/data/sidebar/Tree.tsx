import { GraphT } from "@/lib/types/warehouse";

interface Props {
  tree: GraphT;
  node: GraphT;
  depth: number;
  handleLeaf: (data: GraphT, leaf: GraphT) => void;
}

const TreeNode: React.FC<Props> = ({ tree, node, depth, handleLeaf }) => {
  console.log(node);
  return (
    <li>
      <div className="prose" onClick={() => handleLeaf(tree, node)}>
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
  handleLeaf: (data: GraphT, leaf: GraphT) => void;
}> = ({ graph, handleLeaf }) => {
  const tree = graph;

  return (
    <ul className="menu bg-inherit rounded-box w-full">
      <TreeNode tree={tree} node={graph} depth={0} handleLeaf={handleLeaf} />
    </ul>
  );
};
