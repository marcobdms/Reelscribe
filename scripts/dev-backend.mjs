import { spawn } from "node:child_process"
import { existsSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const backendDirectory = path.join(projectRoot, "backend-python")
const virtualEnvironmentPython = process.platform === "win32"
  ? path.join(backendDirectory, ".venv", "Scripts", "python.exe")
  : path.join(backendDirectory, ".venv", "bin", "python")

if (!existsSync(virtualEnvironmentPython)) {
  const setupCommand = process.platform === "win32"
    ? "py -3.11 -m venv backend-python\\.venv"
    : "python3.11 -m venv backend-python/.venv"

  console.error("[BACK] No existe el entorno virtual backend-python/.venv.")
  console.error(`[BACK] Créalo primero con: ${setupCommand}`)
  process.exit(1)
}

const backend = spawn(
  virtualEnvironmentPython,
  [
    "-m",
    "uvicorn",
    "app.main:app",
    "--reload",
    "--host",
    "127.0.0.1",
    "--port",
    "8000",
  ],
  {
    cwd: backendDirectory,
    env: process.env,
    stdio: "inherit",
  },
)

backend.on("error", (error) => {
  console.error(`[BACK] No se pudo iniciar Python: ${error.message}`)
  process.exitCode = 1
})

backend.on("exit", (code) => {
  process.exit(code ?? 1)
})

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    backend.kill(signal)
  })
}
