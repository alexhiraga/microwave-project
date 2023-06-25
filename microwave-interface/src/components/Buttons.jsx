import React, { useState } from 'react'

const Buttons = ({ 
    program,
    setProgram,
    customPrograms,
    setCustomPrograms,
    setPower,
    setTime,
    setCaracterAquecimento,
    turnOn,
    pause,
    quickStart,
    isEditable,
    setIsEditable,
}) => {

    const [showForm, setShowForm] = useState(false)

    const openForm = () => {
        clearForm()

        setShowForm(true)
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProgram((prevState) => ({
        ...prevState,
        [name]: value,
        }));
    }

    const handleCreateProgram = async(e) => {
        e.preventDefault();
        try {
            const params = {
                nome: program.nome,
                alimento: program.alimento,
                time: program.time,
                power: program.power,
                caracterAquecimento: program.caracteraquecimento,
                instrucoes: program.instrucoes
            }
            const res = await fetch('https://localhost:7109/api/CustomHeating/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            })
            const jsonData = await res.json()

            if(jsonData.predefinedValue) {
                setCustomPrograms([...customPrograms, jsonData.predefinedValue])
            }
        } catch (e) {
            console.error(e)
        }
    }

    const handleCancelCreatingProgram = (e) => {
        e.preventDefault()
        clearForm()
        setShowForm(false)
    }

    const clearForm = () => {
        setProgram({
            id: '',
            nome: '',
            alimento: '',
            time: '',
            power: '',
            caracteraquecimento: '',
            editable: true
        })
    }

    const showProgramInfo = (program) => {
        setShowForm(false)
        setProgram(program)
        if(program.editable) setIsEditable(true)
        if(!program.editable) setIsEditable(false)
        setCaracterAquecimento(program.caracterAquecimento)
        setPower(program.power)
        setTime(program.time)
    }

    const deleteProgram = async() => {
        const id = program.id
        if(!id || showForm) {
            clearForm()
            return
        }

        try {
            const res = await fetch(`https://localhost:7109/api/CustomHeating/${program.id}`, {
                method: 'DELETE'
            })
            if(res.ok) {
                setCustomPrograms((program) => program.filter((item) => item.id !== id))
                clearForm()
            }
        } catch (e) {
            console.error(e)
        }
    }

    const clearProgram = () => {
        clearForm()
        setTime(1)
        setPower(10)
        setIsEditable(true)
        setCaracterAquecimento(".")
    }


    return (
        <div>
            <div className="flex justify-center gap-3 my-4">
                <button
                    className="py-2 px-4 rounded bg-green-600 hover:bg-green-700 transition-colors"
                    onClick={turnOn}
                >
                    Ligar/+30s
                </button>

                <button
                    className="py-2 px-4 rounded bg-yellow-600 hover:bg-yellow-700 transition-colors"
                    onClick={pause}
                >
                    Pausar/Cancelar
                </button>

                <button
                    className="py-2 px-4 rounded bg-teal-600 hover:bg-teal-700 transition-colors"
                    onClick={quickStart}
                >
                    Início rápido
                </button>

                {program.id && (
                    <button
                        className="py-2 px-4 rounded bg-red-600 hover:bg-red-700 transition-colors"
                        onClick={clearProgram}
                    >
                        Limpar   
                    </button>
                )}
            </div>

            <div className="flex justify-center gap-3 mx-auto">
                {showForm ? (
                    <div className="w-1/4">
                        <h3 className="text-left text-xl mb-2 font-bold">Criar programa:</h3>
                        <form onSubmit={handleCreateProgram}>
                            <label className="flex flex-col text-left">
                            <span>Nome:</span>
                            <input 
                                className="py-1 px-2 mt-1 mb-2 rounded"
                                type="text" 
                                name="nome" 
                                required
                                placeholder="Nome do programa"
                                value={program.nome}
                                onChange={handleInputChange}
                            />
                            </label>
                            
                            <label className="flex flex-col text-left">
                            <span>Alimento:</span>
                            <input 
                                className="py-1 px-2 mt-1 mb-2 rounded"
                                type="text" 
                                name="alimento" 
                                required
                                placeholder="Nome do alimento"
                                value={program.alimento}
                                onChange={handleInputChange}
                            />
                            </label>

                            <div className="flex gap-3">
                                <div className="w-1/2">

                                    <label className="flex flex-col text-left">
                                    <span>Tempo (em segundos):</span>
                                    <input 
                                        className="py-1 px-2 mt-1 mb-2 rounded"
                                        type="number" 
                                        min="1"
                                        name="time" 
                                        required
                                        value={program.time}
                                        onChange={handleInputChange}
                                    />
                                    </label>
                                </div>

                                <div className="w-1/2">
                                    <label className="flex flex-col text-left">
                                    <span>Potência (1 a 10):</span>
                                    <input 
                                        className="py-1 px-2 mt-1 mb-2 rounded"
                                        type="number" 
                                        min="1"
                                        max="10"
                                        name="power" 
                                        required
                                        value={program.power}
                                        onChange={handleInputChange}
                                    />
                                    </label>
                                </div>

                            </div>

                            <label className="flex flex-col text-left">
                            <span>Caracter de aquecimento:</span>
                            <input
                                type="text"
                                className="py-1 px-2 mt-1 mb-2 rounded"
                                name="caracteraquecimento"
                                onChange={handleInputChange}
                                value={program.caracteraquecimento}
                                placeholder="Caracter de aquecimento"
                            />
                            </label>

                            <label className="flex flex-col text-left">
                            <span>Instruções:</span>
                            <textarea
                                className="py-1 px-2 mt-1 mb-2 rounded"
                                name="instrucoes"
                                onChange={handleInputChange}
                                value={program.instrucoes}
                                placeholder="Instruções de uso"
                            />
                            </label>

                            <button
                                className="bg-green-600 py-2 px-4 rounded hover:bg-green-700 transition-colors float-left mr-2"
                                onClick={handleCreateProgram}
                            >
                                Criar novo programa 
                            </button>
                            <button
                                className="bg-red-500 py-2 px-4 rounded hover:bg-red-600 transition-colors float-left"
                                onClick={handleCancelCreatingProgram}
                            >
                                Cancelar
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="w-1/4 text-left">
                        <h3 className="text-left text-xl mb-2 font-bold">Informações do programa:</h3>
                        <span>Nome:</span>
                        <p className="mt-1 mb-3 text-neutral-400 text-sm">{program.nome}</p>
                        <span>Alimento:</span>
                        <p className="mt-1 mb-3 text-neutral-400 text-sm">{program.alimento}</p>
                        <span>Tempo:</span>
                        <p className="mt-1 mb-3 text-neutral-400 text-sm">{program.time}</p>
                        <span>Potência:</span>
                        <p className="mt-1 mb-3 text-neutral-400 text-sm">{program.power}</p>
                        <span>Instruções:</span>
                        <p className="mt-1 mb-3 text-neutral-400 text-sm">{program.instrucoes}</p>
                        <button 
                            className="bg-blue-500 py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                            onClick={openForm}
                        >
                            Criar novo programa
                        </button>
                        {isEditable && program.id && (
                            <button 
                                className="bg-red-500 py-2 px-4 rounded hover:bg-red-600 transition-colors mx-2"
                                onClick={deleteProgram}
                                >
                                Deletar programa
                            </button>
                        )}

                    </div>
                )}
                
                <div className="w-1/4">

                    <h3 className="text-left text-xl mb-2 font-bold">Programas:</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {customPrograms.map((program) => (
                            <div key={program.caracterAquecimento}>
                                    {program.editable ? (
                                        <button className="w-20 h-20 p-2 mt-2 leading-4 bg-transparent rounded border border-green-100 hover:bg-neutral-900 transition-colors italic text-green-100 text-sm break-all"
                                            onClick={() => showProgramInfo(program)}
                                        >
                                            {program.nome.length > 14 ? program.nome.substring(0,15) + '...' : program.nome}
                                        </button>
                                    ) : (
                                        <button className="w-20 h-20 p-2 mt-2 leading-4 bg-transparent rounded border border-neutral-300 hover:bg-neutral-900 transition-colors text-sm break-all"
                                            onClick={() => showProgramInfo(program)}
                                        >
                                            {program.nome.length > 14 ? program.nome.substring(0,15) + '...' : program.nome}
                                        </button>
                                    )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Buttons