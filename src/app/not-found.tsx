// app/not-found.js or app/not-found.tsx
export default function NotFound() {
    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="text-gray-500">Sorry, the page you are looking for does not exist.</p>
        </div>
    );
}
