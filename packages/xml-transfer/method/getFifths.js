const getFifths = (fifths) => {
  switch (fifths) {
    case "0":
      return "C";
    case "1":
      return "G";
    case "2":
      return "D";
    case "3":
      return "A";
    case "4":
      return "E";
    case "5":
      return "B";
    case "6":
      return "F#";
    case "7":
      return "C#";
    case "-7":
      return "Cb";
    case "-6":
      return "Gb";
    case "-5":
      return "Db";
    case "-4":
      return "Ab";
    case "-3":
      return "eb";
    case "-2":
      return "Bb";
    case "-1":
      return "F";
    case "0":
      return "";
    default:
      throw new Error("no step");
  }
};

export default getFifths;

