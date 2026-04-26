export const transcribeWithAddisAI = async (
  audioBlob: Blob,
  language: 'am' | 'om' | 'en'
) => {
  const formData = new FormData()

  formData.append("audio", audioBlob, "voice.webm")

  const langCode =
    language === "am" ? "am" :
    language === "om" ? "om" :
    "en"

  formData.append(
    "request_data",
    JSON.stringify({
      language_code: langCode
    })
  )

  const res = await fetch("/api/addis/stt", {
    method: "POST",
    body: formData
  })

  return res.json()
}



export const generateSpeechWithAddisAI = async (
  text: string,
  language: 'am' | 'om' | 'en'
) => {
  const res = await fetch("/api/addis/tts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text,
      language
    })
  })

  return res.json()
}