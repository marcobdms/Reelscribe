import Foundation

@MainActor
class TranscriptionViewModel: ObservableObject {
    
    @Published var videoURL: String = ""
    @Published var transcription: String = ""
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    func transcribe() async {
        
        guard !videoURL.isEmpty else { return }
        
        isLoading = true
        errorMessage = nil
        
        do {
            let result = try await APIService.shared.transcribeVideo(url: videoURL)
            transcription = result.transcription
        } catch {
            errorMessage = "Failed to transcribe video"
        }
        
        isLoading = false
    }
}