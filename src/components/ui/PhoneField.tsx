import React from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement>;

const PhoneField = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
  return (
    <input
      {...props}
      ref={ref}
      id={props.id ?? 'phone'}
      name={props.name ?? 'phone'}
      type="tel"
      autoComplete="tel"
      inputMode="tel"
      className={props.className}
    />
  );
});

PhoneField.displayName = 'PhoneField';

export default PhoneField;
