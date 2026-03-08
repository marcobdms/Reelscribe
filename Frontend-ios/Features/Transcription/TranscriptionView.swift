import SwiftUI

struct TranscriptionView: View {
    
    @StateObject private var viewModel = TranscriptionViewModel()
    
    var body: some View {
        
        VStack(spacing: 20) {
            
            TextField("Paste video URL", text: $viewModel.videoURL)
                .textFieldStyle(.roundedBorder)
            
            Button("Transcribe") {
                Task {
                    await viewModel.transcribe()
                }
            }
            
            if viewModel.isLoading {
                ProgressView()
            }
            
            ScrollView {
                Text(viewModel.transcription)
                    .padding()
            }
            
        }
        .padding()
    }
}