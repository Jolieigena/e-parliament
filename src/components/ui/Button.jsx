const Button = ({ as: As = 'button', variant = 'primary', size = 'md', className = '', children, ...rest }) => (
  <As className={`btn btn-${variant} btn-${size} ${className}`} {...rest}>
    {children}
  </As>
);

export default Button;
