const calculateBookingPrice = (basePrice, nights, userType) => {
  const subtotal = basePrice * nights;
  let discountAmount = 0;
  
  if (userType === 'student') {
    discountAmount = subtotal * 0.15;
  } else if (userType === 'military') {
    discountAmount = subtotal * 0.20;
  }

  const tax = (subtotal - discountAmount) * 0.18;
  const totalPrice = subtotal - discountAmount + tax;

  return { subtotal, discountAmount, tax, totalPrice };
};

// Test cases
console.log("Student booking (100/night, 3 nights):");
console.log(calculateBookingPrice(100, 3, 'student'));

console.log("\nMilitary booking (100/night, 3 nights):");
console.log(calculateBookingPrice(100, 3, 'military'));

console.log("\nRegular booking (100/night, 3 nights):");
console.log(calculateBookingPrice(100, 3, 'regular'));
