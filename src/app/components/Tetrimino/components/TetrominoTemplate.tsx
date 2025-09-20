import Block from "@/app/components/Block/page";

// 定义单个方块的数据结构
interface ITetrominoData {
  location: number[];
  isActive?: boolean;
  isHidden?: boolean;
}

// 定义组件 Props 的类型
interface TetrominoTemplateProps {
  // Props 对象中有一个可选的 tetrominoData 属性，它是一个数组
  tetrominoData?: ITetrominoData[];
}

// 创建你的默认数据
const defaultTetrominoData: ITetrominoData[] = [];
for (let i = 0; i < 2; i++) {
  for (let j = 0; j < 4; j++) {
    defaultTetrominoData.push({
      isActive: false,
      isHidden: false,
      location: [i, j],
    });
  }
}

// 在这里应用默认值
export default function TetrominoTemplate({
  tetrominoData = defaultTetrominoData,
}: TetrominoTemplateProps) {
  return (
    <>
      <div
        className="
        inline-grid
        grid-rows-2
        grid-cols-4
        gap-[calc(var(--block-size)*0.1)]
      "
      >
        {
          // 渲染逻辑
          tetrominoData.map((item) => (
            <Block
              isActive={item.isActive}
              isHidden={item.isHidden}
              key={`${item.location[0]}-${item.location[1]}`}
            ></Block>
          ))
        }
      </div>
    </>
  );
}
