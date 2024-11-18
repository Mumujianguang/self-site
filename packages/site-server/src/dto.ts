import { HttpStatus } from "@nestjs/common"
import { ApiProperty } from "@nestjs/swagger"

export default class ResponseDto<IData> {
    @ApiProperty({ description: "状态码", example: 200 })
    public statusCode: number

    @ApiProperty({ description: "消息", example: "success" })
    public message: string

    @ApiProperty({ description: "数据" })
    public data: IData

    constructor(data: IData, message: string = 'success', statusCode: number = HttpStatus.OK) {
        this.statusCode = statusCode
        this.message = message
        this.data = data
    }
}