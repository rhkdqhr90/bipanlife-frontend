import parse from "html-react-parser";
import { PresignedImage } from "../image/PresignedImage";

export const HtmlWithPresignedImages = ({ html }: { html: string }) => {
  return (
    <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none mb-8">
      {parse(html, {
        replace: domNode => {
          if (
            domNode.type === "tag" &&
            domNode.name === "img" &&
            "attribs" in domNode &&
            domNode.attribs?.src
          ) {
            const src = domNode.attribs.src;

            // 1. 새 방식: /images/파일명
            if (src.startsWith("/images/")) {
              const filename = src.replace("/images/", "");
              return <PresignedImage filename={filename} />;
            }

            // 2. 구 방식: http://localhost:9000/bipan-image/파일명
            if (src.startsWith("http://localhost:9000/bipan-image/")) {
              const filename = src.split("/").pop(); // 파일명만 추출
              if (filename) {
                return <PresignedImage filename={filename} />;
              }
            }

            // 3. (선택) 운영 환경 대비: https://cdn.bipanlife.com/... 이라도 처리할 수 있도록 여지 남겨둠
          }
        },
      })}
    </div>
  );
};
