import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Screen from './components/Screen'
import Buttons from './components/Buttons'

function App() {

    const [time, setTime] = useState(1)
    const [power, setPower] = useState(10)
    const [caracterAquecimento, setCaracterAquecimento] = useState(".")
    const [heatingSound, setHeatingSound] = useState("")
    const [isHeating, setIsHeating] = useState(false)
    const [isEditable, setIsEditable] = useState(true)
    const [message, setMessage] = useState("")
    const [program, setProgram] = useState({
        id: '',
        nome: '',
        alimento: '',
        time: '',
        power: '',
        caracteraquecimento: ''
    })
    const [customPrograms, setCustomPrograms] = useState([])

    useEffect(() => {
        const getPrograms = async () => {
            try {
                const res = await fetch('https://localhost:7109/api/CustomHeating')
                const jsonData = await res.json()
                setCustomPrograms(jsonData.predefinedValues)
            } catch(e) {
                console.error(e)
            }
        }
        getPrograms()
    }, [])

    
    const turnOn = async() => {
        if(time < 1) {
            setMessage('Tempo inválido.')
            return
        }
        const validatedPower = power === "" || isNaN(power) ? 10 : parseFloat(power)
        if(!power) {
            setPower(10)
        }
        try {
            const params = {
                time,
                power: validatedPower,
                caracterAquecimento
            }
            const res = await fetch('https://localhost:7109/api/Microwave', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            })
            const jsonData = await res.json()
            setIsHeating(true)
            if(jsonData.message && !jsonData.time) {
                setMessage(jsonData.message)
            }

        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        setInterval(() => {
            setMessage("")
        }, 5000)
    }, [message])

    const pause = async() => {
        try {
            const res = await fetch('https://localhost:7109/api/Microwave/pause', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            const jsonData = await res.json()
        } catch (e) {
            console.error(e)
        }
    }

    const quickStart = async() => {
        try {
            const res = await fetch('https://localhost:7109/api/Microwave/quickstartmicrowave', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            const jsonData = await res.json()
            setIsHeating(true)
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        if(!isHeating) return
        let intervalId

        const getRemainingTime = async() => {
            try {
                const res = await fetch('https://localhost:7109/api/Microwave')                
                const data = await res.json()
                setHeatingSound(data.message)
                setTime(data.secondsRemaining)
                if(data.message == 'Aquecimento concluído.' || !data.secondsRemaining) {
                    clearInterval(intervalId)
                    setTime(0)
                    setIsHeating(false)
                }
            } catch (e) {
                console.error(e)
            }
        }

        if(isHeating) {
            intervalId = setInterval(getRemainingTime, 1000)
        }

        return () => {
            clearInterval(intervalId)
        }
    }, [isHeating])

    return (
        <div className="flex w-full">
            <Navbar />
            <div className="w-11/12 text-center mx-auto my-16">
                <Screen 
                    power={power}
                    setPower={setPower}
                    time={time}
                    setTime={setTime}
                    isHeating={isHeating}
                    heatingSound={heatingSound}
                    isEditable={isEditable}
                    message={message}
                />
                <Buttons 
                    program={program}
                    setProgram={setProgram}
                    customPrograms={customPrograms}
                    setCustomPrograms={setCustomPrograms}
                    setPower={setPower}
                    setTime={setTime}
                    setCaracterAquecimento={setCaracterAquecimento}
                    turnOn={turnOn}
                    pause={pause}
                    quickStart={quickStart}
                    isEditable={isEditable}
                    setIsEditable={setIsEditable}
                />
            </div>
        </div>
    )
}

export default App
