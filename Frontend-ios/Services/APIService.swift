import Foundation

class APIService {
    
    static let shared = APIService()
    
    func transcribeVideo(url: String) async throws -> Transcription {
        
        let endpoint = URL(string: "\(Constants.baseURL)/transcribe")!
        
        var request = URLRequest(url: endpoint)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body = ["url": url]
        request.httpBody = try JSONEncoder().encode(body)
        
        let (data, _) = try await URLSession.shared.data(for: request)
        
        let result = try JSONDecoder().decode(Transcription.self, from: data)
        
        return result
    }
}