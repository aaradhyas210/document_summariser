import React, { useEffect, useRef, useState } from "react";
import {
	Button,
	CircularProgress,
	IconButton,
	InputAdornment,
	TextField,
	styled,
} from "@mui/material";
import Background from "../Assets/PwC_Geom_28.png";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import SendIcon from "@mui/icons-material/Send";

const DocumentSummariser = () => {
	const drop = useRef(null);
	const [file, setFile] = useState(null);
	//eslint-disable-next-line
	const [fileContent, setFileContent] = useState("");
	const [question, setQuestion] = useState("");
	const [answer, setAnswer] = useState("");
	const [uploadSuccess, setUploadSuccess] = useState(false);
	const [answerLoading, setAnswerLoading] = useState(false);
	const [showAnswerSection, setShowAnswerSection] = useState(false);

	const SelectFile = (e) => {
		setFile(e.target.files[0]);
		ReadFile(e.target.files[0]);
		setUploadSuccess(true);
	};

	const ReadFile = (file) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			setFileContent(e.target.result);
		};
		reader.readAsText(file);
	};

	const BrowseFile = () => {
		document.getElementById("fileSelector").click();
	};

	useEffect(() => {
		drop?.current?.addEventListener("dragover", HandleDragOver);
		drop?.current?.addEventListener("drop", HandleDrop);
		return () => {
			//eslint-disable-next-line
			drop?.current?.removeEventListener("dragover", HandleDragOver);
			//eslint-disable-next-line
			drop?.current?.removeEventListener("drop", HandleDrop);
		};
		//eslint-disable-next-line
	}, []);

	const HandleDragOver = (e) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const HandleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setFile(e.dataTransfer.files[0]);
		ReadFile(e.dataTransfer.files[0]);
		setUploadSuccess(false);
	};

	const onQuestionInputChange = (e) => {
		setQuestion(e.target.value);
	};

	const questionSubmissionCheck = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			AskQuestion();
		}
	};

	const AskQuestion = () => {
		setAnswerLoading(true);
		let formData = new FormData();
		formData.append("file", file);
		formData.append("question", question);
		fetch("https://generativeaidev.azurewebsites.net/fileupload", {
			method: "POST",
			body: formData,
		})
			.then((res) => res.json())
			.then((data) => {
				setAnswer(data?.answer);
				setAnswerLoading(false);
				setShowAnswerSection(true);
			})
			.catch((err) => {
				console.log(err);
				setAnswerLoading(false);
			});
	};

	return (
		<Container>
			<Header>Document Summarisation Using GPT-3</Header>
			<Wrapper>
				<WrapperHeader>Upload a Text File & Ask Questions</WrapperHeader>
				<FileDropZoneContainer>
					<FileDropZone ref={drop}>
						<CloudUploadIcon style={{ fontSize: 60, color: "#D93954" }} />
						<UploadText className="large">Drag file to upload</UploadText>
						<UploadText className="small">Or</UploadText>
						<BrowseFileButton onClick={BrowseFile}>
							Browse Files
						</BrowseFileButton>
						<HiddenInput
							id="fileSelector"
							accept=".txt,.pdf"
							type="file"
							onChange={SelectFile}
						/>
					</FileDropZone>
					{file && (
						<PreviewContainer>
							<RowFlexContainer>
								<DescriptionIcon style={{ fontSize: 40, marginRight: "5px" }} />
								<UploadText className="small">
									{file?.name} <br />
									{Math.round(file?.size / 100000) / 10} MB
								</UploadText>
							</RowFlexContainer>
						</PreviewContainer>
					)}
				</FileDropZoneContainer>

				{uploadSuccess && (
					<>
						<QuestionInput
							placeholder="Type your question here..."
							onChange={onQuestionInputChange}
							onKeyUp={questionSubmissionCheck}
							value={question}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton onClick={AskQuestion}>
											<SendIcon style={{ color: "#D93954" }} />
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
						{answerLoading && (
							<CircularProgress
								style={{ color: "#D93954", marginBottom: "20px" }}
							/>
						)}
						{showAnswerSection && <AnswerSection>{answer}</AnswerSection>}
					</>
				)}
			</Wrapper>
		</Container>
	);
};

const Container = styled("div")({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	minHeight: "100vh",
	backgroundImage: `url(${Background})`,
	backgroundSize: "cover",
	backgroundPosition: "center",
});

const Header = styled("div")({
	position: "absolute",
	top: 0,
	textAlign: "center",
	padding: "10px 40px",
	fontSize: "25px",
	fontWeight: 400,
	textTransform: "uppercase",
	boxShadow: "0px 20px 15px -10px rgba(0,0,0,0.3)",
	color: "#EBEBEB",
	background: "#2D2D2D",
});

const Wrapper = styled("div")({
	display: "flex",
	flexDirection: "column",
	width: "60%",
	background: "#FFFFFF",
	justifyContent: "space-between",
	alignItems: "center",
	marginTop: "50px",
	borderRadius: "10px",
	boxShadow: "0px 20px 15px -10px rgba(0,0,0,0.3)",
});

const WrapperHeader = styled("div")({
	fontSize: "20px",
	fontWeight: 400,
	textTransform: "uppercase",
	color: "#EBEBEB",
	boxShadow: "0px 20px 15px -10px rgba(0,0,0,0.3)",
	background: "#2D2D2D",
	padding: "10px 40px",
	borderRadius: "10px 10px 0 0",
	textAlign: "center",
	width: "-webkit-fill-available",
});

const FileDropZoneContainer = styled("div")({
	display: "flex",
	alignItems: "center",
	justifyContent: "space-evenly",
	width: "100%",
	margin: "40px 0",
	flexWrap: "wrap",
});

const FileDropZone = styled("div")({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	padding: "60px 40px",
	border: "3px dashed #2D2D2D",
	borderRadius: "20px",
});

const UploadText = styled("div")({
	fontWeight: 350,
	fontFamily: "Helvetica Neue",
	color: "#2D2D2D",
	textAlign: "left",
	"&.large": {
		fontSize: "20px",
	},
	"&.small": {
		fontSize: "15px",
	},
});

const BrowseFileButton = styled(Button)({
	background: "#D93954",
	color: "#FFFFFF",
	fontWeight: 400,
	fontSize: "15px",
	padding: "5px 20px",
	marginTop: "10px",
	borderRadius: "30px",
	"&:hover": {
		background: "#D93954",
		opacity: 0.8,
	},
});

const HiddenInput = styled("input")({
	display: "none",
});

const PreviewContainer = styled("div")({
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	alignItems: "flex-start",
	minWidth: "200px",
});

const RowFlexContainer = styled("div")({
	display: "flex",
	justifyContent: "flex-start",
	alignItems: "center",
});

const QuestionInput = styled(TextField)({
	resize: "none",
	width: "80%",
	borderRadius: "20px",
	marginBottom: "20px",
	backgroundColor: "#EEEEEE",
	"& fieldset": {
		borderColor: "#FFFFFF",
	},
	"& .MuiOutlinedInput-root": {
		"&:hover fieldset": {
			borderColor: "#D93954",
			borderRadius: "20px",
		},
	},
	"& .MuiOutlinedInput-root.Mui-focused": {
		"& > fieldset": {
			borderColor: "#D93954",
			borderRadius: "20px",
		},
	},
});

const AnswerSection = styled("div")({
	width: "75%",
	borderRadius: "10px",
	marginBottom: "20px",
	backgroundColor: "#EEEEEE",
	minHeight: "70px",
	padding: "20px 20px",
	textAlign: "left",
	fontFamily: "Helvetica Neue",
	fontSize: "15px",
	fontWeight: 350,
});

export default DocumentSummariser;
