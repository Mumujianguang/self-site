import ResponseDto from "src/dto";
import { ApiProperty } from "@nestjs/swagger";
import { IHuaweiActivityRecord, IHuaweiToken } from "./huawei.interface";

/**
 * 获取token - 请求体
 */
export class HuaweiAccessTokenBody {
    @ApiProperty({
        type: 'string',
        description: 'auth code'
    })
    public code: string;
}

/**
 * 运动记录 - 请求体
 */
export class HuaweiActivityRecordsQuery {
    @ApiProperty({
        type: 'string',
        description: '开始时间'
    })
    public startTime: string;

    @ApiProperty({
        type: 'string',
        description: '结束时间'
    })
    public endTime: string; 
}

/**
 * 获取token - 响应体
 */
export class HuaweiAccessTokenResponse extends ResponseDto<IHuaweiToken> {
    @ApiProperty({
        type: 'string',
        description: 'token'
    })
    public data: IHuaweiToken;
}

/**
 * 运动记录 - 响应体
 */
export class HuaweiActivityRecordsResponse extends ResponseDto<IHuaweiActivityRecord[]> {
    public data: IHuaweiActivityRecord[];
}