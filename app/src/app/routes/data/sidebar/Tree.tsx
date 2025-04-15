import { GraphT } from "@/lib/types/warehouse";

interface Props {
  node: GraphT;
  depth: number;
}

const TreeNode: React.FC<Props> = ({ node, depth }) => {
  return (
    <li>
      <a>{node.name}</a>
      {node.children.length > 0 && (
        <ul>
          {node.children.map((child: GraphT, index: number) => (
            <TreeNode key={index} node={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
};

export const RenderTree: React.FC<{ graph: GraphT }> = ({ graph }) => {
  return (
    <ul className="menu bg-base-200 rounded-box w-56">
      <TreeNode node={graph} depth={0} />
    </ul>
  );
};
