package ai.service;

import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;

import admin.service.ObjectStorageService;

@Service
public class ChatGPTService {
    @Autowired
    private ObjectStorageService objectStorageService;
    private String bucketName = "bitcamp-edu-bucket-111";

    public void downloadAndSaveImage(String imageUrl, String fileName) throws Exception {
        URL url = new URL(imageUrl); // imageUrl을 기반으로 URL 객체 생성
        Resource resource = new UrlResource(url); // url을 이용하여 UrlResource 객체를 생성한다.

        // S3 버킷에 업로드할 파일의 경로
        String s3FilePath = "flirdogStorage/aiDogProfile/" + fileName;

        // 이미지의 InputStream을 얻는다.
        try (InputStream inputStream = resource.getInputStream()) {
            // S3 버킷에 이미지 업로드
            objectStorageService.uploadFile(bucketName, s3FilePath, inputStream, "image/jpeg");
        }

        // 업로드된 이미지 경로를 리스트에 추가
        List<String> imagePaths = new ArrayList<>();
        imagePaths.add(s3FilePath);

        // 콘솔에 업로드된 파일 경로 출력 (디버깅용)
        System.out.println("Uploaded to S3: " + imagePaths.get(0));
    }
}


// private RestTemplate restTemplate = new RestTemplate();
// // @Value("${openai.key}")
// private String apiKey =
// "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";

// public void OpenAiService(RestTemplateBuilder restTemplateBuilder) {
// this.restTemplate = restTemplateBuilder.build();
// }

// public String fetchImageUrl(String prompt) {
// HttpHeaders headers = new HttpHeaders();
// headers.set("Authorization", "Bearer " + apiKey);
// headers.setContentType(MediaType.APPLICATION_JSON);

// HttpEntity<Map<String, Object>> request = new HttpEntity<>(Map.of("prompt",
// prompt), headers);
// ResponseEntity<Map> response =
// restTemplate.postForEntity("https://api.openai.com/v1/images/generations",
// request, Map.class);

// // OpenAI 응답에서 이미지 URL 추출 (응답 구조에 따라 조정 필요)
// String imageUrl = (String) response.getBody().get("url");
// return imageUrl;
// }