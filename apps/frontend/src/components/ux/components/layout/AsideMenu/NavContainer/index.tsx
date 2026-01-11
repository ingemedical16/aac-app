import { NavItem } from "../NavItem";

const navItems = [
  { title: "Dashboard", icon: "🏠" },
  { title: "Board", icon: "🧩" },
  { title: "Profiles", icon: "👤" },
  { title: "Settings", icon: "⚙️" },
];

export function NavContainer({ collapsed }: { collapsed: boolean }) {
  return (
    <nav>
      {navItems.map(item => (
        <NavItem
          key={item.title}
          title={item.title}
          icon={item.icon}
          collapsed={collapsed}
        />
      ))}
    </nav>
  );
}
