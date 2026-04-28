const aboutController = (req, res) => {
  res.render("about");
//   res.sendFile(join(process.cwd(), "public/css", "about.ejs"));
};

export { aboutController };