import { useState, useRef, useEffect, useCallback } from "react"
import { useForm, Controller } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import CustomCheckbox from "../custom/custom-checkbox"
import { Textarea } from "../ui/textarea"
import { snow, gasleak, manOverboard, personalInjury, propertyDamage, others } from "@/assets/icons"
import { ArrowLeft, ArrowRight, Trash2, Mic, Play, Pause, Square, Edit } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

const schema = z.object({
  taskType: z.string().min(1, "Please select a task type"),
  description: z.string().min(5, "Description must be at least 5 characters long"),
})

export type schemaType = z.infer<typeof schema>

const levelBackgrounds = {
  1: "linear-gradient(96.65deg, #FF5755 0%, #FBADAD 97.03%)",
  2: "linear-gradient(96.65deg, #F3BD50 0%, #FBE1AD 97.03%)",
  3: "linear-gradient(96.65deg, #5EE865 0%, #BAFBC9 97.03%)",
}

const TaskTypes = [
  { icon: snow, label: "Fire", value: "fire" },
  { icon: personalInjury, label: "Personal injury", value: "personal_injury" },
  { icon: gasleak, label: "Gas Leak", value: "gas_leak" },
  { icon: manOverboard, label: "Man over board", value: "man_overboard" },
  { icon: propertyDamage, label: "Property damage", value: "property_damage" },
  { icon: others, label: "Others", value: "others" },
]

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

const AdminTaskAddFrom = ({ _id }: { _id: string }) => {
  const [step, setStep] = useState(1)
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordedText, setRecordedText] = useState("")
  const [recordings, setRecordings] = useState<
    Array<{
      id: string
      text: string
      audio: string | null
      isPlaying: boolean
      timestamp: number
    }>
  >([])
  const recognitionRef = useRef<any | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const router = useRouter()
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null)
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const [liveTranscript, setLiveTranscript] = useState("")
  const audioElementsRef = useRef<{ [key: string]: HTMLAudioElement }>({})

  const formMethods = useForm<schemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      taskType: "",
      description: "",
    },
    mode: "all",
  })

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = formMethods

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !analyser) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    analyser.getByteTimeDomainData(dataArray)

    ctx.fillStyle = "rgb(255, 255, 255)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.lineWidth = 2
    ctx.strokeStyle = "#3DA229"
    ctx.beginPath()

    const sliceWidth = canvas.width / bufferLength
    let x = 0

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0
      const y = (v * canvas.height) / 2

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }

      x += sliceWidth
    }

    ctx.lineTo(canvas.width, canvas.height / 2)
    ctx.stroke()

    if (isRecording && !isPaused) {
      animationFrameRef.current = requestAnimationFrame(drawWaveform)
    }
  }, [analyser, isRecording, isPaused])

  useEffect(() => {
    if (isRecording && !isPaused && canvasRef.current) {
      drawWaveform()
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isRecording, isPaused, drawWaveform])

  const onNext = () => setStep(2)
  const onBack = () => setStep(1)

  const startRecording = async () => {
    try {
      if (!SpeechRecognition) {
        alert("Speech recognition is not supported in this browser.")
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setMediaStream(stream)

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        const audioUrl = URL.createObjectURL(audioBlob)

        if (recordedText.trim()) {
          const newRecordingId = Math.random().toString(36).substring(7)
          setRecordings((prev) => [
            ...prev,
            {
              id: newRecordingId,
              text: recordedText.trim(),
              audio: audioUrl,
              isPlaying: false,
              timestamp: Date.now(),
            },
          ])
          // Clear recorded text for next recording
          setRecordedText("")
          setLiveTranscript("")
        }
      }

      const audioCtx = new AudioContext()
      const source = audioCtx.createMediaStreamSource(stream)
      const analyserNode = audioCtx.createAnalyser()
      analyserNode.fftSize = 2048

      source.connect(analyserNode)
      setAudioContext(audioCtx)
      setAnalyser(analyserNode)

      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = "en-US"

      recognition.onstart = () => {
        setIsRecording(true)
        setIsPaused(false)
        mediaRecorder.start()
      }

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join("")

        setLiveTranscript(transcript)
        setRecordedText(transcript)
      }

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        stopRecording()
      }

      recognition.onend = () => {
        if (!isPaused) {
          stopRecording()
        }
      }

      recognitionRef.current = recognition
      recognition.start()
    } catch (err) {
      console.error("Error accessing microphone:", err)
      alert("Error accessing microphone. Please ensure microphone permissions are granted.")
    }
  }

  const pauseRecording = () => {
    if (recognitionRef.current && mediaRecorderRef.current) {
      setIsPaused(true)
      recognitionRef.current.stop()
      mediaRecorderRef.current.pause()

      // Append the current recorded text to the description
      const currentDescription = watch("description") || ""
      const newDescription = currentDescription ? `${currentDescription}\n\n${recordedText}` : recordedText
      setValue("description", newDescription.trim(), { shouldValidate: true })

      // Only add the current recording to the recordings list if there's content
      if (recordedText.trim()) {
        const newRecordingId = Math.random().toString(36).substring(7)
        setRecordings((prev) => [
          ...prev,
          {
            id: newRecordingId,
            text: recordedText.trim(),
            audio: null, // We don't have audio for paused recordings
            isPlaying: false,
            timestamp: Date.now(),
          },
        ])
      }

      // Clear the recorded text for the next segment
      setRecordedText("")
      setLiveTranscript("")
    }
  }

  const resumeRecording = () => {
    if (recognitionRef.current && mediaRecorderRef.current) {
      setIsPaused(false)
      recognitionRef.current.start()
      mediaRecorderRef.current.resume()
    }
  }

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
    }
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop())
      setMediaStream(null)
    }
    if (audioContext) {
      audioContext.close()
      setAudioContext(null)
    }
    setAnalyser(null)
    setIsRecording(false)
    setIsPaused(false)

    // Append the recorded text to the description
    const currentDescription = watch("description") || ""
    const newDescription = currentDescription ? `${currentDescription}\n\n${recordedText}` : recordedText
    setValue("description", newDescription.trim(), { shouldValidate: true })

    // Only add the current recording to the recordings list if there's content
    if (recordedText.trim()) {
      const newRecordingId = Math.random().toString(36).substring(7)
      setRecordings((prev) => [
        ...prev,
        {
          id: newRecordingId,
          text: recordedText.trim(),
          audio: null, // We don't have audio for stopped recordings
          isPlaying: false,
          timestamp: Date.now(),
        },
      ])
    }

    // Clear the recorded text for the next recording
    setRecordedText("")
    setLiveTranscript("")
  }, [mediaStream, audioContext, recordedText, setValue, watch])

  const togglePlayRecording = useCallback((recordingId: string) => {
    setRecordings((prev) =>
      prev.map((rec) => {
        if (rec.id === recordingId) {
          if (!rec.isPlaying) {
            if (!audioElementsRef.current[recordingId]) {
              const audio = new Audio(rec.audio || "")
              audio.onended = () => {
                setRecordings((prev) => prev.map((r) => (r.id === recordingId ? { ...r, isPlaying: false } : r)))
              }
              audioElementsRef.current[recordingId] = audio
            }
            audioElementsRef.current[recordingId].play()
          } else {
            audioElementsRef.current[recordingId].pause()
            audioElementsRef.current[recordingId].currentTime = 0
          }
          return { ...rec, isPlaying: !rec.isPlaying }
        }
        // Stop other playing recordings
        if (rec.isPlaying) {
          audioElementsRef.current[rec.id]?.pause()
          audioElementsRef.current[rec.id].currentTime = 0
          return { ...rec, isPlaying: false }
        }
        return rec
      }),
    )
  }, [])

  const editRecording = useCallback(
    (text: string) => {
      setValue("description", text, { shouldValidate: true })
    },
    [setValue],
  )

  const deleteRecording = useCallback(
    (recordingId: string) => {
      setRecordings((prev) => {
        const newRecordings = prev.filter((rec) => rec.id !== recordingId)
        const updatedDescription = newRecordings.map((rec) => rec.text).join("\n\n")
        setValue("description", updatedDescription, { shouldValidate: true })
        return newRecordings
      })
    },
    [setValue],
  )

  function generateUniqueIncidentId() {
    const prefix = "INCID"
    const randomNumbers = Math.floor(100000 + Math.random() * 900000)
    const randomChars = Array.from({ length: 2 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join(
      "",
    )

    const id = `${prefix}-${randomNumbers}${randomChars}`
    return id
  }

  const onSubmit = (data: schemaType) => {
    const formData = {
      level: selectedLevel,
      taskType: data.taskType,
      description: data.description,
      id: generateUniqueIncidentId(),
      recordings: recordings.map((rec) => ({ text: rec.text })),
    }
    localStorage.setItem("taskFormData", JSON.stringify(formData))
    router.push(`/admin/exploration-and-production/add-incidents/${_id}`)
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        {step === 1 ? (
          <div className="mb-4">
            <div className="w-full flex items-center justify-between my-3">
              <Label htmlFor="taskType" className="block text-[20px] font-medium text-gray-700">
                Type of Emerge-x cases
              </Label>
              <div>
                <span className="text-green-400 text-[22px]">{step}</span> /2
              </div>
            </div>

            <hr />

            <div className="flex flex-col mb-4">
              <div className="flex justify-start w-full pt-4 pb-4 gap-4">
                {[1, 2, 3].map((level) => (
                  <div
                    key={level}
                    className={`flex items-center justify-center px-5 py-2 LevelBUttonBG buttonHeightWidth text-white rounded-md cursor-pointer ${
                      selectedLevel === level ? "bg-light-greento-white border border-transparent" : ""
                    }`}
                    style={selectedLevel === level ? { background: levelBackgrounds[level as keyof typeof levelBackgrounds] } : {}}
                    onClick={() => setSelectedLevel(level)}
                  >
                    <span className="ml-2 text-[16px] text-black font-medium">Level {level}</span>
                  </div>
                ))}
              </div>
              <p className="customTTextStyle">
                Level 1 emergency incidents on an oil rig include minor fires, small leaks equipment malfunctions that
                do not pose an immediate threat to personnel or the environment.
              </p>
            </div>
            <Controller
              name="taskType"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-3 gap-3">
                  {TaskTypes.map((task) => (
                    <div key={task.value} className="flex items-center size-full">
                      <CustomCheckbox
                        id={`checkbox-${task.value}`}
                        label={task.label}
                        icon={task.icon}
                        description={`Task: ${task.label}`}
                        checked={field.value === task.value}
                        onChange={(checked) => {
                          if (checked) {
                            field.onChange(task.value)
                          } else {
                            field.onChange("")
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            />
            {errors.taskType && <span className="text-red-500 text-xs">{errors.taskType.message}</span>}
          </div>
        ) : (
          <div className="mb-8">
            <div className="relative">
              <div className="w-full flex items-center justify-between my-3">
                <Label htmlFor="taskType" className="block text-[20px] font-medium text-gray-700">
                  Description
                </Label>
                <div>
                  <span className="text-green-400 text-[22px]">{step}</span> /2
                </div>
              </div>
              <p className="customTTextStyle mt-4 mb-3">
                While Adding description please mention some important datas on it like{" "}
                <strong className="text-black font-normal">
                  No of injured people, Status, Damage assets, Finance, Location, etc.{" "}
                </strong>
              </p>
              <hr className="mb-6" />
              <div className="relative">
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id="description"
                      placeholder="Enter your description here"
                      rows={10}
                      className="pt-4 rounded-[20px] text-[16px] overflow-y-auto max-h-[400px]"
                    />
                  )}
                />
                <div className="absolute right-4 bottom-4 flex gap-2">
                  {isRecording ? (
                    <>
                      {isPaused ? (
                        <Button type="button" variant="ghost" onClick={resumeRecording} className="p-2">
                          <Play className="h-6 w-6 text-green-500" />
                        </Button>
                      ) : (
                        <Button type="button" variant="ghost" onClick={pauseRecording} className="p-2">
                          <Pause className="h-6 w-6 text-yellow-500" />
                        </Button>
                      )}
                    
                    </>
                  ) : (
                    <Button type="button" variant="ghost" onClick={startRecording} className="p-2">
                      <Mic className="h-6 w-6 text-gray-500" />
                    </Button>
                  )}
                </div>
              </div>
              {errors.description && <span className="text-red-500 text-xs">{errors.description.message}</span>}
            </div>
            {isRecording && (
              <div className="mt-4 p-4 rounded-lg border bg-white">
                <canvas ref={canvasRef} width={600} height={100} className="w-full h-[100px] mb-4" />
                {liveTranscript && <p className="text-sm text-gray-600 animate-pulse">{liveTranscript}</p>}
              </div>
            )}
          {recordings.length > 0 && (
  <div className="space-y-4 mt-6 max-h-[400px] overflow-y-auto pr-2">
    {recordings
      .sort((a, b) => b.timestamp - a.timestamp)
      .map((recording) => (
        <div key={recording.id} className="p-4 rounded-3xl border bg-white max-w-2xl">
          <div>
            {/* <div className="flex items-center gap-4">
              <Image
                src="/images/WaveImg.svg"
                alt="wave"
                width={500}
                height={500}
                className="w-full max-w-[100px] mb-2"
              />
            </div> */}
            <p className="customTTextStyle text-[14px] mb-2 text-gray-700 leading-relaxed">
              {recording.text}
            </p>
            <div className="flex gap-2">
              {/* <Button
                variant="secondary"
                className="flex items-center gap-1 text-[14px]"
                // onClick={() => console.log("Edit clicked")}
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button> */}
              <Button
                variant="secondary"
                className="flex items-center gap-2 text-[14px]"
                onClick={() => deleteRecording(recording.id)}
              >
                <Trash2 className="h-4 w-4 text-red-600" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}
  </div>
)}

          </div>
        )}
        {step === 2 && (
          <div className="flex flex-row items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              className="text-black self-end hover:bg-transparent p-0"
            >
              <span className="p-4 mr-4 backBFG rounded-[15px]">
                <ArrowLeft size={12} />
              </span>
              Back
            </Button>
            <Button
              type="submit"
              variant="ghost"
              disabled={!watch("description")}
              className="text-black self-end hover:bg-transparent"
            >
              Next
              <span
                className="p-4 ml-4 bg-gradient-to-r rounded-[15px] from-[10%] from-[#3DA229] to-[#247814]"
                style={{
                  background: "linear-gradient(89.14deg, #3DA229 0.68%, #247814 100%)",
                }}
              >
                <ArrowRight size={12} />
              </span>
            </Button>
          </div>
        )}
        {step === 1 && (
          <Button
            type="button"
            variant="ghost"
            disabled={!watch("taskType") || !selectedLevel}
            onClick={onNext}
            className="text-black self-end hover:bg-transparent mt-4"
          >
            Next
            <span
              className="p-4 ml-4 bg-gradient-to-r rounded-[15px] from-[10%] from-[#3DA229] to-[#247814]"
              style={{
                background: "linear-gradient(89.14deg, #3DA229 0.68%, #247814 100%)",
              }}
            >
              <ArrowRight size={12} />
            </span>
          </Button>
        )}
      </form>
    </div>
  )
}

export default AdminTaskAddFrom

