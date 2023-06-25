import { GithubLogo, LinkedinLogo } from 'phosphor-react'

const Navbar = () => {

    return (
        <nav className="flex flex-col justify-between bg-neutral-900 py-10 align-middle w-1/12 h-screen text-center mx-auto fixed z-10">
            <a href="#" target="_blank" className="transition-colors">
                the microwave.
            </a>

            <div className="flex flex-col justify-between text-4xl gap-3 text-center mx-auto ">
                <a href="https://github.com/alexhiraga" target="_blank">
                    <GithubLogo className="transition-colors" />
                </a>
                <a href="https://www.linkedin.com/in/alexhiraga/" target="_blank">
                    <LinkedinLogo className="transition-colors" />
                </a>
            </div>
        </nav>
    )
}

export default Navbar