import useTetrominoShape from "@/app/utils/useTetrominoShape";
import TetrominoTemplate from "./TetrominoTemplate";
export default function OTermoino() {
  const tetrominoData = useTetrominoShape("o");
  return <TetrominoTemplate tetrominoData={tetrominoData}></TetrominoTemplate>;
}
