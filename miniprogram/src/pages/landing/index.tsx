import { useState, useEffect } from 'react'
import { View, Text, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useGenealogyStore } from '../../stores/genealogyStore'
import { LANDING_TEXTS } from '../../utils/copywriting'
import './index.scss'

export default function Landing() {
  const [currentLine, setCurrentLine] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const { setPersonData, setMode } = useGenealogyStore()

  useEffect(() => {
    typeText(LANDING_TEXTS[0], 0)
  }, [])

  const typeText = (text: string, lineIndex: number) => {
    let i = 0
    setDisplayedText('')
    const timer = setInterval(() => {
      i++
      setDisplayedText(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(timer)
        setTimeout(() => {
          if (lineIndex < LANDING_TEXTS.length - 1) {
            setCurrentLine(lineIndex + 1)
            typeText(LANDING_TEXTS[lineIndex + 1], lineIndex + 1)
          } else {
            setShowInput(true)
          }
        }, 500)
      }
    }, 60)
  }

  const handleSubmit = () => {
    const name = inputValue.trim()
    if (!name) return
    setPersonData('grandmother', { id: 'grandmother', fullName: name })
    setMode('normal')
    Taro.navigateTo({ url: '/pages/flow/index' })
  }

  const handleUnknown = () => {
    setMode('completion')
    Taro.navigateTo({ url: '/pages/completion/index' })
  }

  return (
    <View className='landing'>
      <View className='texts'>
        {LANDING_TEXTS.map((text, index) => (
          <View key={index} className='line' style={{ opacity: index <= currentLine ? 1 : 0 }}>
            <Text className={index === LANDING_TEXTS.length - 1 ? 'text-amber' : ''}>
              {index === currentLine ? displayedText : index < currentLine ? text : ''}
            </Text>
          </View>
        ))}
      </View>

      {showInput && (
        <View className='input-area'>
          <Input
            className='input-line'
            placeholder='输入她的名字...'
            placeholderStyle='color: #57534e'
            value={inputValue}
            onInput={(e) => setInputValue(e.detail.value)}
            onConfirm={handleSubmit}
            focus
            confirmType='next'
          />
          {inputValue.trim() && (
            <View className='submit-btn' onClick={handleSubmit}>
              <Text>→</Text>
            </View>
          )}
        </View>
      )}

      {showInput && (
        <View className='unknown-btn' onClick={handleUnknown}>
          <Text>我不知道外婆的名字</Text>
        </View>
      )}

      <View className='footer'>
        <Text className='text-stone-600'>全程本地处理，不上传服务器</Text>
      </View>
    </View>
  )
}
