import { Link } from "react-router-dom";

export default function Example() {
  return (
    <div className=" bg-gray-200">
      <header className="inset-x-0 top-0 z-50   bg-gray-200">
        <nav
          className="flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1"></div>
          <div className="flex lg:hidden"></div>
          <div className="hidden lg:flex lg:gap-x-12">
            <Link
              to={"/h72xutmpivrro7"}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              <a className="text-sm font-semibold leading-6 text-gray-900">
                New game
              </a>
            </Link>
            <Link
              to={"/h72xutmpivrro7/third"}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              <a className="text-sm font-semibold leading-6 text-gray-900">
                Control panel
              </a>
            </Link>
            <Link
              to={"/h72xutmpivrro7/fourth"}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              <a className="text-sm font-semibold leading-6 text-gray-900">
                Add Points
              </a>
            </Link>
            <Link
              to={"/h72xutmpivrro7/fifth"}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              <a className="text-sm font-semibold leading-6 text-gray-900">
                Game History
              </a>
            </Link>
            <Link
              to={"/h72xutmpivrro7/bracket"}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              <a className="text-sm font-semibold leading-6 text-gray-900">
                Bracket
              </a>
            </Link>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end"></div>
        </nav>
      </header>
    </div>
  );
}
