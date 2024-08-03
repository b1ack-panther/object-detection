import ObjectDetection from "@/components/ObjectDetection";

export default function Home() {
  
  return (
    <main className="flex min-h-screen flex-col p-8 items-center ">
      <h1 className="gradient-title font-extrabold text-3xl md:text-6xl lg:text-8xl tracking-tighter">Object Detection Tool</h1>
      <ObjectDetection />
    </main>
  );
}

