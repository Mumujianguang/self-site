export interface Huawei {}

export interface IHuaweiToken {
    access_token: string
    expired_in: number
    refresh_token: string
    scope: string
    token_type: string
    id_token: string
}

export interface IHuaweiActivityRecordDetail {
    
}

export interface IHuaweiActivityRecord {
    id: string
    name: string
    desc: string
    startTime: string
    endTime: string
    activeTime: string
    activityType: number
    // 数据来源 0:默认 1:真实运动 2:用户手动输入 3:课程记录 4:可连接器械 5:自动识别
    sourceType: 0 | 1 | 2 | 3 | 4 | 5

    details: IHuaweiActivityRecordDetail[]
}