export default function NavBar(){
  return (
    <nav className="w-full p-4 flex justify-between bg-black bg-opacity-40 backdrop-blur">
      <span className="font-bold">XferLogic</span>
      <div className="flex gap-4">
        <a href="/">Home</a>
        <a href="/dashboard">Dashboard</a>
      </div>
    </nav>
  );
}