import { Link } from "react-router-dom"

export function NavLink({ href, children }) {
  return (
    <Link
      to={href}
      className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900"
    >
      {children}
    </Link>
  )
}
