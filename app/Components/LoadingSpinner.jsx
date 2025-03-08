// Components/LoadingSpinner.js
export default function LoadingSpinner() {
    return (
        <div className="absolute w-full h-[80vh] flex justify-center items-center bg-black/20 rounded-lg shadow-lg">
            <div className="flex justify-center items-center w-full h-screen">
                <div className="text-center flex flex-col justify-center items-center">
                    <div className="spinner-border animate-spin h-8 w-8 border-t-4 border-indigo-500 rounded-full mb-4" />
                    <span className="ml-2 text-indigo-400 font-medium">Loading...</span>
                </div>
            </div>
        </div>
    );
}
