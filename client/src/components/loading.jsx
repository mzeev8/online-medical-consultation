import React from "react";

const Loading = () => {
    return (
        <div className="grid h-screen w-screen place-items-center">
            <div className="flex flex-row gap-2">
                <div className="h-4 w-4 animate-bounce rounded-full bg-blue-700"></div>
                <div className="h-4 w-4 animate-bounce rounded-full bg-blue-700 [animation-delay:-.3s]"></div>
                <div className="h-4 w-4 animate-bounce rounded-full bg-blue-700 [animation-delay:-.5s]"></div>
            </div>
        </div>
    );
};

export default Loading;
