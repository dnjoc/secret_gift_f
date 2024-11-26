import { useState, useEffect } from "react";
const Notification = ({ message, indicator }) => {
  const [classMessage, setClassMessage] = useState("")
  useEffect(() => {
    if (indicator) {
      setClassMessage("error")
    } else {
      setClassMessage("msgnull")
    }
  }, [indicator]);
  if (message === null) {
    return null
  }
  return (
    <div className={classMessage} >
      {message}
    </div>
  )
}

export default Notification