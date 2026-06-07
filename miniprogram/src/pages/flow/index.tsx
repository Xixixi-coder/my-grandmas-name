import { useState, useEffect } from 'react'
import { View, Text, Input, Textarea } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useGenealogyStore } from '../../stores/genealogyStore'
import { detectEra, getQuestionsByEra, getEraLabel } from '../../utils/nameEraEngine'
import { validateChineseName } from '../../utils/validators'
import './index.scss'

export default function Flow() {
  const { currentStep, grandmother, mother, user, setPersonData, nextStep, prevStep } = useGenealogyStore()

  return (
    <View className='flow'>
      {/* Progress */}
      <View className='progress'>
        {[1, 2, 3, 4, 5, 6].map((s) => (
          <View
            key={s}
            className={`dot ${s < currentStep ? 'done' : s === currentStep ? 'active' : ''}`}
          />
        ))}
      </View>

      {/* Steps */}
      {currentStep === 1 && (
        <StepNameInput
          prompt='外婆叫什么名字？'
          target='grandmother'
          onNext={nextStep}
          setPersonData={setPersonData}
          person={grandmother}
        />
      )}
      {currentStep === 2 && <StepNameOrigin />}
      {currentStep === 3 && <StepWish target='grandmother' />}
      {currentStep === 4 && <StepMotherInput />}
      {currentStep === 5 && <StepUserInput />}
      {currentStep === 6 && <StepGenerate />}

      {/* Back button */}
      {currentStep > 1 && currentStep < 6 && (
        <View className='back-btn' onClick={prevStep}>
          <Text>← 上一步</Text>
        </View>
      )}
    </View>
  )
}

function StepNameInput({ prompt, target, onNext, setPersonData, person }) {
  const [name, setName] = useState(person?.fullName || '')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    const v = validateChineseName(name)
    if (!v.valid) { setError(v.message || ''); return }
    const { era } = detectEra(name)
    setPersonData(target, { id: target, fullName: name.trim(), era })
    onNext()
  }

  return (
    <View className='step'>
      <Text className='prompt'>{prompt}</Text>
      <Input
        className='input-line'
        value={name}
        onInput={(e) => { setName(e.detail.value); setError('') }}
        onConfirm={handleSubmit}
        placeholder='输入她的全名...'
        placeholderStyle='color: #57534e'
        focus
      />
      {error && <Text className='error'>{error}</Text>}
      <View className='btn-primary' onClick={handleSubmit}>
        <Text>下一步 →</Text>
      </View>
    </View>
  )
}

function StepNameOrigin() {
  const { grandmother, setPersonData, nextStep } = useGenealogyStore()
  const era = grandmother.era || 'unknown'
  const eraQ = getQuestionsByEra(era)
  const [selected, setSelected] = useState<string | null>(null)

  const handleNext = () => {
    setPersonData('grandmother', { nameOrigin: { category: 'other', customStory: selected || '' } })
    nextStep()
  }

  return (
    <View className='step'>
      <Text className='era-label'>{getEraLabel(era)}</Text>
      <Text className='prompt'>{eraQ.question}</Text>
      <View className='options'>
        {eraQ.options.map((opt) => (
          <View
            key={opt.value}
            className={`option ${selected === opt.value ? 'selected' : ''}`}
            onClick={() => setSelected(opt.value)}
          >
            <Text>{opt.label}</Text>
          </View>
        ))}
      </View>
      {selected && (
        <View className='btn-primary' onClick={handleNext}>
          <Text>继续 →</Text>
        </View>
      )}
    </View>
  )
}

function StepWish({ target }) {
  const store = useGenealogyStore()
  const person = store[target]
  const [wish, setWish] = useState(person?.youngWish || '')

  const handleNext = () => {
    if (!wish.trim()) return
    store.setPersonData(target, { youngWish: wish.trim() })
    store.nextStep()
  }

  return (
    <View className='step'>
      <Text className='prompt'>{person?.fullName || '她'}年轻时最想成为什么？</Text>
      <Text className='hint'>如果不知道，可以猜</Text>
      <Textarea
        className='textarea'
        value={wish}
        onInput={(e) => setWish(e.detail.value)}
        placeholder='比如：想当老师 / 想去看海...'
        placeholderStyle='color: #57534e'
        maxlength={200}
        autoFocus
      />
      <View className='btn-primary' onClick={handleNext}>
        <Text>下一步 →</Text>
      </View>
    </View>
  )
}

function StepMotherInput() {
  const { mother, setPersonData, nextStep } = useGenealogyStore()
  const [phase, setPhase] = useState<'name' | 'wish'>(mother.fullName ? 'wish' : 'name')
  const [name, setName] = useState(mother.fullName || '')
  const [wish, setWish] = useState(mother.youngWish || '')

  const handleName = () => {
    const v = validateChineseName(name)
    if (!v.valid) return
    const { era } = detectEra(name)
    setPersonData('mother', { id: 'mother', fullName: name.trim(), era })
    setPhase('wish')
  }

  const handleWish = () => {
    if (!wish.trim()) return
    setPersonData('mother', { youngWish: wish.trim() })
    nextStep()
  }

  return (
    <View className='step'>
      {phase === 'name' ? (
        <>
          <Text className='prompt'>现在，你妈妈叫什么名字？</Text>
          <Input
            className='input-line'
            value={name}
            onInput={(e) => setName(e.detail.value)}
            onConfirm={handleName}
            placeholder='妈妈的全名...'
            placeholderStyle='color: #57534e'
            focus
          />
          <View className='btn-primary' onClick={handleName}>
            <Text>继续 →</Text>
          </View>
        </>
      ) : (
        <>
          <Text className='prompt'>{name}年轻时最想做什么？</Text>
          <Textarea
            className='textarea'
            value={wish}
            onInput={(e) => setWish(e.detail.value)}
            placeholder='比如：想去南方闯闯 / 想继续读书...'
            placeholderStyle='color: #57534e'
            maxlength={200}
          />
          <View className='btn-primary' onClick={handleWish}>
            <Text>下一步 →</Text>
          </View>
        </>
      )}
    </View>
  )
}

function StepUserInput() {
  const { user: u, setPersonData, nextStep } = useGenealogyStore()
  const [phase, setPhase] = useState<'name' | 'wish'>(u.fullName ? 'wish' : 'name')
  const [name, setName] = useState(u.fullName || '')
  const [wish, setWish] = useState(u.youngWish || '')

  const handleName = () => {
    const v = validateChineseName(name)
    if (!v.valid) return
    const { era } = detectEra(name)
    setPersonData('user', { id: 'user', fullName: name.trim(), era })
    setPhase('wish')
  }

  const handleWish = () => {
    if (!wish.trim()) return
    setPersonData('user', { youngWish: wish.trim() })
    nextStep()
  }

  return (
    <View className='step'>
      {phase === 'name' ? (
        <>
          <Text className='prompt'>最后——你自己叫什么？</Text>
          <Input
            className='input-line'
            value={name}
            onInput={(e) => setName(e.detail.value)}
            onConfirm={handleName}
            placeholder='你的全名...'
            placeholderStyle='color: #57534e'
            focus
          />
          <View className='btn-primary' onClick={handleName}>
            <Text>继续 →</Text>
          </View>
        </>
      ) : (
        <>
          <Text className='prompt'>你现在最想做的事是什么？</Text>
          <Textarea
            className='textarea'
            value={wish}
            onInput={(e) => setWish(e.detail.value)}
            placeholder='比如：想辞职去旅行 / 想好好睡一觉...'
            placeholderStyle='color: #57534e'
            maxlength={200}
          />
          <View className='btn-primary' onClick={handleWish}>
            <Text>看看三代人的答案 →</Text>
          </View>
        </>
      )}
    </View>
  )
}

function StepGenerate() {
  const { grandmother, mother, user } = useGenealogyStore()

  useEffect(() => {
    const timer = setTimeout(() => {
      Taro.redirectTo({ url: '/pages/output/index' })
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <View className='step generate'>
      <Text className='text-stone-500' style={{ fontSize: '26rpx' }}>三代人的名字与愿望</Text>

      <View className='gen-item'>
        <Text className='gen-name grandma'>{grandmother.fullName}</Text>
        <Text className='gen-wish'>想{grandmother.youngWish?.slice(0, 20)}...</Text>
      </View>

      <Text className='arrow'>↓</Text>

      <View className='gen-item'>
        <Text className='gen-name mother'>{mother.fullName}</Text>
        <Text className='gen-wish'>想{mother.youngWish?.slice(0, 20)}...</Text>
      </View>

      <Text className='arrow'>↓</Text>

      <View className='gen-item'>
        <Text className='gen-name self'>{user.fullName}</Text>
        <Text className='gen-wish'>想{user.youngWish?.slice(0, 20)}...</Text>
      </View>
    </View>
  )
}
