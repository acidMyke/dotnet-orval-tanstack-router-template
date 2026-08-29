import { Checkbox as HeadlessCheckbox, Description, Field as HeadlessField, Label, Radio, RadioGroup } from '@headlessui/react'
import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import { Check, Dot, type LucideIcon } from 'lucide-react'

type RadioOption = {
  label: string
  value: string
  description?: string
}

type BaseFieldProps = {
  label: string
  description?: string
}

type TextInputFieldProps = BaseFieldProps & {
  placeholder?: string
  type?: 'email' | 'password' | 'search' | 'text' | 'url'
  autoComplete?: string
  icon?: LucideIcon
}

type CheckboxFieldProps = BaseFieldProps

type RadioGroupFieldProps = BaseFieldProps & {
  options: RadioOption[]
}

const { fieldContext, useFieldContext, formContext } = createFormHookContexts()

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null
  }

  return <p className="text-xs text-error">{message}</p>
}

function readFirstError(errors: unknown[]) {
  const first = errors[0]

  if (typeof first === 'string') {
    return first
  }

  if (first instanceof Error) {
    return first.message
  }

  return first ? 'Invalid value' : undefined
}

function TextInputField({
  autoComplete,
  description,
  icon: Icon,
  label,
  placeholder,
  type = 'text',
}: TextInputFieldProps) {
  const field = useFieldContext<string>()
  const errorMessage = readFirstError(field.state.meta.errors)

  return (
    <label className="form-control w-full gap-1">
      <span className="label-text font-medium">{label}</span>
      {description ? <span className="text-xs text-base-content/70">{description}</span> : null}
      <div className="relative">
        {Icon ? <Icon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-base-content/60" /> : null}
        <input
          autoComplete={autoComplete}
          className={`input input-bordered w-full ${Icon ? 'pl-9' : ''} ${errorMessage ? 'input-error' : ''}`}
          onBlur={field.handleBlur}
          onChange={(event) => field.handleChange(event.target.value)}
          placeholder={placeholder}
          type={type}
          value={field.state.value ?? ''}
        />
      </div>
      <FieldError message={errorMessage} />
    </label>
  )
}

function CheckboxField({ description, label }: CheckboxFieldProps) {
  const field = useFieldContext<boolean>()

  return (
    <HeadlessField className="flex items-start gap-3">
      <HeadlessCheckbox
        checked={Boolean(field.state.value)}
        className="group mt-0.5 inline-flex size-5 items-center justify-center rounded-md border border-base-300 bg-base-200 text-primary-content transition data-[checked]:border-primary data-[checked]:bg-primary"
        onBlur={field.handleBlur}
        onChange={(checked) => field.handleChange(checked)}
      >
        <Check className="size-3 opacity-0 transition group-data-[checked]:opacity-100" />
      </HeadlessCheckbox>
      <div className="space-y-1">
        <Label className="cursor-pointer text-sm font-medium">{label}</Label>
        {description ? <Description className="text-xs text-base-content/70">{description}</Description> : null}
      </div>
    </HeadlessField>
  )
}

function RadioGroupField({ description, label, options }: RadioGroupFieldProps) {
  const field = useFieldContext<string>()
  const errorMessage = readFirstError(field.state.meta.errors)

  return (
    <div className="space-y-2">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {description ? <p className="text-xs text-base-content/70">{description}</p> : null}
      </div>
      <RadioGroup className="space-y-2" onChange={(value) => field.handleChange(value)} value={field.state.value}>
        {options.map((option) => {
          const isChecked = field.state.value === option.value

          return (
            <HeadlessField
              className={`flex cursor-pointer items-start gap-3 rounded-box border p-3 transition ${
                isChecked ? 'border-primary bg-primary/10' : 'border-base-300 bg-base-200/60'
              }`}
              key={option.value}
            >
              <Radio
                className={`mt-0.5 inline-flex size-5 items-center justify-center rounded-full border ${
                  isChecked ? 'border-primary bg-primary/20 text-primary' : 'border-base-content/50 text-transparent'
                }`}
                value={option.value}
              >
                <Dot className="size-3" />
              </Radio>
              <div>
                <Label className="cursor-pointer text-sm font-medium">{option.label}</Label>
                {option.description ? <Description className="text-xs text-base-content/70">{option.description}</Description> : null}
              </div>
            </HeadlessField>
          )
        })}
      </RadioGroup>
      <FieldError message={errorMessage} />
    </div>
  )
}

export const { useAppForm } = createFormHook({
  fieldComponents: {
    CheckboxField,
    RadioGroupField,
    TextInputField,
  },
  fieldContext,
  formContext,
})
