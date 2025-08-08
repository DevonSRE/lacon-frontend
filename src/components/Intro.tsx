
export default function Intro({ user }: { user: string }) {
    const today = new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
    return (
        <div>
            <h1 className="text-xl font-bold  text-gray-900 mb-2 uppercase">Welcome {user}</h1>
            <p className="text-gray-600 text-sm">Today, {today}</p>
        </div>

    );
}