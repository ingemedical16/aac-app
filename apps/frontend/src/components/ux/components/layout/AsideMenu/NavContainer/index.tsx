import { NavGroup } from "../NavGroup";


const navGroups = [
  {
    title: "Main",
    items: [
      { title: "Dashboard", icon: "🏠" },
      { title: "Board", icon: "🧩" },
    ],
  },
  {
    title: "Profiles",
    items: [{ title: "Children", icon: "👶" }],
  },
];

export function NavContainer({
  collapsed,
  onItemClick,
}: {
  collapsed: boolean;
  onItemClick: () => void;
}) {
  return (
    <nav>
      {navGroups.map(group => (
        <NavGroup
          key={group.title}
          {...group}
          collapsed={collapsed}
          onItemClick={onItemClick}
        />
      ))}
    </nav>
  );
}
