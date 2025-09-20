import {TetrominoShape} from "@/app/static/shaps"

export default function useTetrominoShape (shaps:string){
    const tetrominoData = [];
    const {O,L,J,T,S,Z,I} =TetrominoShape
    for (let i = 1; i <= 2; i++) {
        for (let j = 1; j <= 4; j++) {
            switch(shaps){
                case(O):
                    if(i == 1&&j == 2){
                        tetrominoData.push({
                            isActive: true,
                            isHidden: false,
                            location: [i, j],
                          });
                    }
                    else if(i == 1&&j == 3){
                        tetrominoData.push({
                            isActive: true,
                            isHidden: false,
                            location: [i, j],
                          });
                    }
                    else if(i == 2&&j == 2){
                        tetrominoData.push({
                            isActive: true,
                            isHidden: false,
                            location: [i, j],
                          });
                    }
                    else if(i == 2&&j == 3){
                        tetrominoData.push({
                            isActive: true,
                            isHidden: false,
                            location: [i, j],
                          });
                    }else{
                        tetrominoData.push({
                            isHidden: true,
                            // isActive: false,
                            location: [i, j],
                          });
                    }
            }
            
        }
      }

    // for (let i = 0; i < 2; i++) {
    //     for (let j = 0; j < 4; j++) {
    //       defaultTetrominoData.push({
    //         isActive: false,
    //         isHidden: false,
    //         location: [i, j],
    //       });
    //     }
    //   }
    return tetrominoData
}