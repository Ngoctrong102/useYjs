import { ArrowUpOutlined } from "@ant-design/icons";

export type Props = {
  user: {
    name: string;
    color: string;
    location: { x: number; y: number };
  };
};

export default function User({ user }: Props) {
  return (
    <div style={{
      position: "relative",
      top: user.location.y,
      left: user.location.x,
      color: user.color,
      zIndex: 1000
    }}>
      <ArrowUpOutlined rotate={-45} />
      <p style={{fontSize: 12, paddingLeft: 16, transform: 'translate(-3px, -5px)'}}>{user.name}</p>
    </div>
  );
}
