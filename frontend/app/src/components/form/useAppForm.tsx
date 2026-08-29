import {
  Checkbox as HeadlessCheckbox,
  Description,
  Field as HeadlessField,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Radio,
  RadioGroup,
  Switch,
} from '@headlessui/react'
import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import { Check, ChevronDown, Dot, type LucideIcon } from 'lucide-react'

type RadioOption = {
  label: string
  value: string
  description?: string
}

type SelectOption = {
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

type TextAreaFieldProps = BaseFieldProps & {
  placeholder?: string
  rows?: number
}

type SelectFieldProps = BaseFieldProps & {
  options: SelectOption[]
  placeholder?: string
}

type SwitchFieldProps = BaseFieldProps

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

function TextAreaField({ description, label, placeholder, rows = 4 }: TextAreaFieldProps) {
  const field = useFieldContext<string>()
  const errorMessage = readFirstError(field.state.meta.errors)

  return (
    <label className="form-control w-full gap-1">
      <span className="label-text font-medium">{label}</span>
      {description ? <span className="text-xs text-base-content/70">{description}</span> : null}
      <textarea
        className={`textarea textarea-bordered w-full ${errorMessage ? 'textarea-error' : ''}`}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        value={field.state.value ?? ''}
      />
      <FieldError message={errorMessage} />
    </label>
  )
}

function SelectField({ description, label, options, placeholder = 'Select an option' }: SelectFieldProps) {
  const field = useFieldContext<string>()
  const errorMessage = readFirstError(field.state.meta.errors)
  const selectedOption = options.find((option) => option.value === field.state.value)

  return (
    <div className="space-y-1">
      <div className="space-y-0.5">
        <p className="label-text font-medium">{label}</p>
        {description ? <p className="text-xs text-base-content/70">{description}</p> : null}
      </div>
      <Listbox onChange={(value) => field.handleChange(value)} value={field.state.value}>
        <div className="relative">
          <ListboxButton
            className={`btn btn-outline w-full justify-between border-base-300 bg-base-200 px-3 text-left font-normal ${errorMessage ? 'btn-error' : ''}`}
            onBlur={field.handleBlur}
          >
            <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
            <ChevronDown className="size-4 opacity-70" />
          </ListboxButton>
          <ListboxOptions className="absolute z-20 mt-2 max-h-56 w-full overflow-auto rounded-box border border-base-300 bg-base-200 p-1 shadow-xl">
            {options.map((option) => (
              <ListboxOption
                className="group flex cursor-pointer items-start justify-between gap-3 rounded-lg px-3 py-2 text-sm data-[focus]:bg-primary/20"
                key={option.value}
                value={option.value}
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{option.label}</p>
                  {option.description ? <p className="truncate text-xs text-base-content/70">{option.description}</p> : null}
                </div>
                <Check className="mt-0.5 size-4 shrink-0 opacity-0 transition group-data-[selected]:opacity-100" />
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
      <FieldError message={errorMessage} />
    </div>
  )
}

function SwitchField({ description, label }: SwitchFieldProps) {
  const field = useFieldContext<boolean>()

  return (
    <HeadlessField className="flex items-center justify-between gap-3 rounded-box border border-base-300 bg-base-200/60 px-3 py-2">
      <div className="space-y-0.5">
        <Label className="cursor-pointer text-sm font-medium">{label}</Label>
        {description ? <Description className="text-xs text-base-content/70">{description}</Description> : null}
      </div>
      <Switch
        checked={Boolean(field.state.value)}
        className="group inline-flex h-6 w-11 items-center rounded-full border border-base-300 bg-base-300 p-0.5 transition data-[checked]:border-primary data-[checked]:bg-primary"
        onBlur={field.handleBlur}
        onChange={(checked) => field.handleChange(checked)}
      >
        <span className="size-4 rounded-full bg-base-100 transition group-data-[checked]:translate-x-5" />
      </Switch>
    </HeadlessField>
  )
}

export const { useAppForm } = createFormHook({
  fieldComponents: {
    CheckboxField,
    RadioGroupField,
    SelectField,
    SwitchField,
    TextInputField,
    TextAreaField,
  },
  fieldContext,
  formComponents: {},
  formContext,
})
