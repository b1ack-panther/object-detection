"use client";

import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { load as cocoSSDLoad } from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import RenderPredictions from "@/utils/RenderPredictions";

const ObjectDetection = () => {
	const [loading, setLoading] = useState(false);
	const webcamRef = useRef(null);
	const canvasRef = useRef(null);

	const detectInterval = useRef(null);

	const runObjectDetection = async (net) => {
		try {
			if (canvasRef.current && webcamRef.current && webcamRef.current.video) {
				canvasRef.current.width = webcamRef.current.video?.videoWidth;
				canvasRef.current.height = webcamRef.current.video?.videoHeight;

				const detectedObjects = await net.detect(
					webcamRef.current?.video,
					10,
					0.6
				);
				const context = canvasRef.current.getContext("2d");
				RenderPredictions(detectedObjects, context);
			}
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		if (
			webcamRef.current !== null &&
			webcamRef.current.video?.readyState == 4
		) {
			webcamRef.current.video.width = webcamRef.current.video.videoWidth;
			webcamRef.current.video.height = webcamRef.current.video.videoHeight;
		}

		const runCoco = async () => {
			setLoading(true);
			const net = await cocoSSDLoad();
			setLoading(false);

			detectInterval.current = setInterval(() => {
				runObjectDetection(net);
			}, 100);
		};
		runCoco();
		return () => clearInterval(detectInterval.current);
	}, [webcamRef, canvasRef]);

  const [webcamList, setWebcamList] = useState([]);
  const [selectedWebcam, setSelectedWebcam]  = useState("")

	useEffect(() => {
		(async () => {
			const webcams = await navigator.mediaDevices
				.enumerateDevices()
				.then(function (devices) {
					return devices.filter((device) => device.kind === "videoinput");
				});
      setWebcamList(webcams);
      if (webcams.length > 0)
        setSelectedWebcam(webcams[0])
		})();
	}, []);
	return (
		<div className="mt-8 flex flex-col gap-2">
			<div className="gap-1 flex items-center">
				<label className="whitespace-nowrap" htmlFor="webcamList">
					Select Webcam
				</label>
        <select
          className="custom-select"
					name="webcamList"
					id="webcamList"
					onChange={(e) => setSelectedWebcam(e.target.value)}
				>
					{webcamList.map((webcam) => (
						<option key={webcam.deviceId} value={webcam.deviceId}>
							{webcam.label ?? "webcam"}
						</option>
					))}
				</select>
			</div>
			{loading ? (
				<div className="gradient-title">Loading...</div>
			) : (
				<div className="flex relative justify-center items-center rounded-md p-1.5 gradient">
					<Webcam
						videoConstraints={{ deviceId: selectedWebcam }}
						ref={webcamRef}
						className="rounded-md w-full lg:h-[720px]"
						muted
					/>
					<canvas
						ref={canvasRef}
						className="absolute top-0 left-0 z-50 w-full lg:h-[720px]"
					/>
				</div>
			)}
		</div>
	);
};

export default ObjectDetection;
