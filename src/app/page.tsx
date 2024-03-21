import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-screen-md space-y-4 py-10">
        <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Tools</h2>
        <ul className="max-w-md list-inside list-disc space-y-1 text-gray-500 dark:text-gray-400">
          <li>
            <Link
              href="/register-sign-protocol-schema"
              className="font-medium text-blue-600 hover:underline dark:text-blue-500"
            >
              Register Sign Protocol Schema
            </Link>
          </li>
        </ul>
      </div>
    </main>
  );
}
