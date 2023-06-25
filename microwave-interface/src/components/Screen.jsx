import React from 'react'

const Screen = ({ time, setTime, power, setPower, isHeating, heatingSound, isEditable, message }) => {
    return (
        <div className="flex text-center mx-auto justify-center w-[875px] my-4">
            <div className="w-[175px] h-[350px] flex flex-col">
                <div className="h-1/2 bg-red-950 border border-green-500 flex flex-col p-2 justify-center">
                    {isHeating ? (
                        <span className="text-5xl font-bold">{power}</span>
                    ) : (
                        <input
                            className="text-5xl font-bold bg-transparent outline-none text-center ml-3"
                            type="number"
                            min="1"
                            max="10"
                            value={power}
                            disabled={isHeating || !isEditable}
                            onChange={(e) => setPower(e.target.value)}
                        />
                    )}
                    <span className="text-sm text-red-300">Potência</span>
                </div>
                <div className="h-1/2 bg-blue-950 border border-green-500 flex flex-col p-2 justify-center">
                    {isHeating ? (
                        <span className="text-5xl font-bold">{time}</span>
                    ) : (
                        <input
                            className="text-5xl font-bold bg-transparent outline-none text-center ml-3"
                            type="number"
                            min="1"
                            value={time}
                            disabled={isHeating || !isEditable}
                            onChange={(e) => setTime(e.target.value)}
                        />
                    )}
                    <span className="text-sm text-blue-300">Tempo</span>
                </div>
            </div>

            <div className="w-[700px] h-[350px] p-3 bg-green-950 border border-green-500 mx-auto text-green-300 align-middle text-xs flex flex-col justify-center overflow-auto">
                {heatingSound}
                {message && (
                    <div className="absolute top-0 left-0 text-red-900 w-full font-bold py-3 bg-red-300">
                        {message}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Screen