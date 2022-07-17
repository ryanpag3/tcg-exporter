
/**
 * TCGPlayer likes to put (Alternate Art) etc on the Name field
 */
export const cleanName = (name: string) => {
    const toReplace = [
        ' (Alternate Art)', 
        ' (Extended Art)', 
        ' (Showcase)', 
        ' (Borderless)'
    ];

    for (const replace of toReplace) {
        name = name.replace(replace, '');
    }

    return name;
}