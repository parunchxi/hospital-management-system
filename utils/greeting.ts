export const getGreeting = () => {
  const hour = new Date().getHours()

  const morningGreetings = [
    'Good Morning!',
    'Rise and shine!',
    'Top of the morning to you!',
    'Wakey wakey, eggs and bakey!',
    'Morning sunshine!',
  ]

  const afternoonGreetings = [
    'Good Afternoon!',
    'Hope your day is going great!',
    'Keep pushing through!',
    'Halfway there!',
    'Hey there, afternoon warrior!',
  ]

  const eveningGreetings = [
    'Good Evening!',
    'Hope you had a great day!',
    'Time to unwind!',
    'Evening vibes!',
    'Relax, you’ve earned it!',
  ]

  if (hour < 12) {
    return morningGreetings[Math.floor(Math.random() * morningGreetings.length)]
  } else if (hour < 18) {
    return afternoonGreetings[
      Math.floor(Math.random() * afternoonGreetings.length)
    ]
  } else {
    return eveningGreetings[Math.floor(Math.random() * eveningGreetings.length)]
  }
}
