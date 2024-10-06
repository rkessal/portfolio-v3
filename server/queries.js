const homeQuery = `{
  home {
    ...homeFields
    body {
      ... on section_variant_1 {
        non-repeat {
          ...non-repeatFields
        }
        repeat {
          ...repeatFields
          reference {
            ... on project {
              ...projectFields
            }
          }
        }
      }
    }
  }
}`

module.exports = {
  homeQuery
}