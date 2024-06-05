import { Link } from "react-router-dom";

export default function Example() {
  return (
    <div className="bg-white">
      <header className="inset-x-0 top-0 z-50">
        <nav
          className="flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt=""
              />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => {}}
            >
              <span className="sr-only">Open main menu</span>
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <Link
              to={"/admin"}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              <a className="text-sm font-semibold leading-6 text-gray-900">
                Second Page
              </a>
            </Link>
            <Link
              to={"/admin/third"}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              <a className="text-sm font-semibold leading-6 text-gray-900">
                Third Page
              </a>
            </Link>
            <Link
              to={"/admin/fourth"}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              <a className="text-sm font-semibold leading-6 text-gray-900">
                Fourth Page
              </a>
            </Link>
            <Link
              to={"/admin/fifth"}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              <a className="text-sm font-semibold leading-6 text-gray-900">
                Fifth Page
              </a>
            </Link>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a
              href="#"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </nav>
      </header>
    </div>
  );
}
