import CropAdvisorChatWithVoice from "@/components/CropAdvisorChatWithVoice";

export default function VoiceTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">AI Voice Assistant Test</h1>
          <p className="text-gray-600">
            Test voice functionality in Amharic, English, and Oromo languages.
          </p>
        </div>
        
        <div className="h-[calc(100vh-200px)]">
          <CropAdvisorChatWithVoice />
        </div>
      </div>
    </div>
  );
}
