import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useGenealogyStore } from '../../stores/genealogyStore'
import { INTERVIEW_QUESTIONS } from '../../utils/copywriting'
import './index.scss'

export default function Completion() {
  const [copied, setCopied] = useState(false)
  const { setMode } = useGenealogyStore()

  const copyQuestions = () => {
    const text = INTERVIEW_QUESTIONS.map((q, i) => `${i + 1}. ${q}`).join('\n')
    Taro.setClipboardData({
      data: text,
      success: () => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    })
  }

  const handleReturn = () => {
    setMode('normal')
    Taro.navigateTo({ url: '/pages/flow/index' })
  }

  return (
    <View className='completion'>
      <View className='header'>
        <Text className='title'>87%的人和你一样</Text>
        <Text className='subtitle'>但你可以现在开始问</Text>
      </View>

      <View className='card'>
        <Text className='card-title'>采访妈妈的10个问题</Text>
        {INTERVIEW_QUESTIONS.map((q, i) => (
          <View key={i} className='question-item'>
            <Text className='q-num'>{i + 1}.</Text>
            <Text className='q-text'>{q}</Text>
          </View>
        ))}
      </View>

      <View className='actions'>
        <View className='btn-primary' onClick={copyQuestions}>
          <Text>{copied ? '已复制到剪贴板 ✓' : '复制这些问题，发给妈妈'}</Text>
        </View>
        <View className='btn-secondary' onClick={handleReturn}>
          <Text>我已经问完了，回去填写 →</Text>
        </View>
      </View>

      <Text className='footer-hint'>这些问题也可以问姨妈、舅舅、或者任何记得她的人</Text>
    </View>
  )
}
