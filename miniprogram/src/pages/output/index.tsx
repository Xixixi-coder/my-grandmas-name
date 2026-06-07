import { useEffect } from 'react'
import { View, Text, Canvas } from '@tarojs/components'
import Taro, { useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { useGenealogyStore } from '../../stores/genealogyStore'
import { getEraLabel } from '../../utils/nameEraEngine'
import './index.scss'

export default function Output() {
  const { grandmother, mother, user, reset } = useGenealogyStore()

  useShareAppMessage(() => ({
    title: `${grandmother.fullName} → ${mother.fullName} → ${user.fullName}`,
    path: '/pages/landing/index',
    imageUrl: '' // TODO: canvas generated image
  }))

  useShareTimeline(() => ({
    title: '三代女性的名字考古 — 你外婆的名字是？',
    path: '/pages/landing/index'
  }))

  const handleSaveImage = async () => {
    try {
      const ctx = Taro.createCanvasContext('shareCanvas')
      const width = 750
      const height = 1000

      // Background
      ctx.setFillStyle('#1c1917')
      ctx.fillRect(0, 0, width, height)

      // Title
      ctx.setFontSize(32)
      ctx.setFillStyle('#e7e5e4')
      ctx.setTextAlign('center')
      ctx.fillText('三代人的名字，三代人的想', width / 2, 80)

      // Grandmother
      ctx.setFontSize(48)
      ctx.setFillStyle('#8B7355')
      ctx.fillText(grandmother.fullName || '', width / 2, 220)
      ctx.setFontSize(24)
      ctx.setFillStyle('#78716c')
      ctx.fillText(`想${grandmother.youngWish?.slice(0, 15) || ''}...`, width / 2, 270)

      // Arrow
      ctx.setFontSize(28)
      ctx.setFillStyle('#44403c')
      ctx.fillText('↓', width / 2, 340)

      // Mother
      ctx.setFontSize(48)
      ctx.setFillStyle('#6B8E6B')
      ctx.fillText(mother.fullName || '', width / 2, 440)
      ctx.setFontSize(24)
      ctx.setFillStyle('#78716c')
      ctx.fillText(`想${mother.youngWish?.slice(0, 15) || ''}...`, width / 2, 490)

      // Arrow
      ctx.setFillStyle('#44403c')
      ctx.fillText('↓', width / 2, 560)

      // User
      ctx.setFontSize(48)
      ctx.setFillStyle('#e7e5e4')
      ctx.fillText(user.fullName || '', width / 2, 660)
      ctx.setFontSize(24)
      ctx.setFillStyle('#78716c')
      ctx.fillText(`想${user.youngWish?.slice(0, 15) || ''}...`, width / 2, 710)

      // Footer
      ctx.setFontSize(20)
      ctx.setFillStyle('#57534e')
      ctx.fillText('妈妈的妈妈叫什么名字', width / 2, 900)

      ctx.draw(false, () => {
        setTimeout(() => {
          Taro.canvasToTempFilePath({
            canvasId: 'shareCanvas',
            success: (res) => {
              Taro.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: () => Taro.showToast({ title: '已保存到相册', icon: 'success' }),
                fail: () => Taro.showToast({ title: '保存失败', icon: 'none' })
              })
            }
          })
        }, 300)
      })
    } catch {
      Taro.showToast({ title: '生成失败', icon: 'none' })
    }
  }

  const handleRestart = () => {
    reset()
    Taro.reLaunch({ url: '/pages/landing/index' })
  }

  return (
    <View className='output'>
      <Text className='page-title'>三代人的名字，三代人的想</Text>

      <View className='card'>
        {[
          { person: grandmother, label: '外婆', colorClass: 'grandma' },
          { person: mother, label: '妈妈', colorClass: 'mother' },
          { person: user, label: '我', colorClass: 'self' }
        ].map(({ person, label, colorClass }) => (
          <View key={label} className='person-row'>
            <View className='person-meta'>
              <Text className='person-label'>{label}</Text>
              {person.era && person.era !== 'unknown' && (
                <Text className='era-tag'>{getEraLabel(person.era)}</Text>
              )}
            </View>
            <Text className={`person-name ${colorClass}`}>{person.fullName}</Text>
            {person.youngWish && (
              <Text className='person-wish'>想{person.youngWish}</Text>
            )}
          </View>
        ))}
      </View>

      <View className='actions'>
        <View className='btn-primary' onClick={handleSaveImage}>
          <Text>保存分享图到相册</Text>
        </View>
        <View className='btn-secondary' onClick={handleRestart}>
          <Text>重新开始</Text>
        </View>
      </View>

      <View className='ending-card'>
        <Text className='ending-text'>
          你正站在她们无法抵达的地方。{'\n'}你的自由，是三代人的接力。
        </Text>
      </View>

      {/* Hidden canvas for image generation */}
      <Canvas
        canvasId='shareCanvas'
        style={{ width: '750px', height: '1000px', position: 'fixed', left: '-9999px' }}
      />
    </View>
  )
}
