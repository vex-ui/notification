let count = 0

export function useID() {
  return `vex:toast-${count++}`
}
